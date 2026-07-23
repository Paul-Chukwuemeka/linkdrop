"use client";

import { CollectionEditor } from "@/components/collections/CollectionEditor";
import { PreviewFrame, type PreviewItem } from "@/components/dashboard/PreviewFrame";
import { LinkRow } from "@/components/links/LinkRow";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Spinner } from "@/components/ui/Spinner";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import toast from "react-hot-toast";
import {
  DndContext,
  PointerSensor,
  closestCenter,
  type CollisionDetection,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { apiFetch, ApiError } from "@/lib/api";
import type { Card, CardItem, Collection, Link as LinkType, UserProfileMe } from "@/lib/types";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

const TOP_CONTAINER_ID = "container:top";
const COLLECTION_CONTAINER_PREFIX = "container:collection:";

function collectionContainerId(collectionId: string) {
  return `${COLLECTION_CONTAINER_PREFIX}${collectionId}`;
}

function isLinkSortableId(id: string) {
  return id.startsWith("link:");
}

function isCollectionSortableId(id: string) {
  return id.startsWith("collection:");
}

function parseLinkId(sortableId: string) {
  return sortableId.replace(/^link:/, "");
}

function parseCollectionId(sortableId: string) {
  return sortableId.replace(/^collection:/, "");
}

function findContainerForId(
  containers: Record<string, string[]>,
  id: string,
): string | null {
  if (id in containers) return id;
  for (const [containerId, itemIds] of Object.entries(containers)) {
    if (itemIds.includes(id)) return containerId;
  }
  return null;
}

function resolveOverContainerId(
  containers: Record<string, string[]>,
  overId: string,
): string | null {
  if (isCollectionSortableId(overId)) {
    return collectionContainerId(parseCollectionId(overId));
  }

  return findContainerForId(containers, overId);
}

function overIndexForContainer(containerItemIds: string[], overId: string) {
  if (containerItemIds.length === 0) return 0;
  if (overId === TOP_CONTAINER_ID) return containerItemIds.length - 1;
  if (overId.startsWith(COLLECTION_CONTAINER_PREFIX))
    return containerItemIds.length - 1;
  if (isCollectionSortableId(overId)) return containerItemIds.length - 1;
  const index = containerItemIds.indexOf(overId);
  if (index === -1) return containerItemIds.length - 1;
  return index;
}

function DroppableArea({
  id,
  className,
  children,
}: {
  id: string;
  className?: string;
  children: React.ReactNode;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div
      ref={setNodeRef}
      className={[className, isOver ? "ring-2 ring-(--color-dark)" : ""]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}

function SortableWrapper({
  id,
  children,
}: {
  id: string;
  children: (dragHandle: { attributes: unknown; listeners: unknown }) => React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={isDragging ? "opacity-60" : undefined}
    >
      {children({ attributes, listeners })}
    </div>
  );
}

export function CardEditor({ cardId }: { cardId: string }) {
  const [card, setCard] = useState<Card | null>(null);
  const [items, setItems] = useState<CardItem[]>([]);
  const [links, setLinks] = useState<LinkType[]>([]);
  const [profile, setProfile] = useState<UserProfileMe | null>(null);
  const [containers, setContainers] = useState<Record<string, string[]>>({
    [TOP_CONTAINER_ID]: [],
  });
  const containersRef = useRef<Record<string, string[]>>(containers);
  const dragStartContainerRef = useRef<string | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSyncingOrder, setIsSyncingOrder] = useState(false);

  const [newLinkTitle, setNewLinkTitle] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");
  const [isAddingLink, setIsAddingLink] = useState(false);

  const [newCollectionTitle, setNewCollectionTitle] = useState("");
  const [isAddingCollection, setIsAddingCollection] = useState(false);

  const linksById = useMemo(() => {
    const map = new Map<string, LinkType>();
    for (const link of links) map.set(link.id, link);
    return map;
  }, [links]);

  const collectionsById = useMemo(() => {
    const map = new Map<string, Collection>();
    for (const item of items) {
      if (item.type === "collection" && item.collection) {
        map.set(item.collection.id, item.collection);
      }
    }
    return map;
  }, [items]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const me = await apiFetch<UserProfileMe>("/api/profile/me");
        if (mounted) setProfile(me);
      } catch {
        // Preview is optional.
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    containersRef.current = containers;
  }, [containers]);

  const load = useCallback(async (opts?: { silent?: boolean }) => {
    setError(null);
    if (!opts?.silent) setIsLoading(true);
    try {
      const [cardData, itemData, linkData] = await Promise.all([
        apiFetch<Card>(`/api/cards/${cardId}`),
        apiFetch<CardItem[]>(`/api/cards/${cardId}/items`),
        apiFetch<LinkType[]>(`/api/links?card_id=${encodeURIComponent(cardId)}`),
      ]);
      setCard(cardData);
      setItems(itemData);
      setLinks(linkData);

      const nextContainers: Record<string, string[]> = {
        [TOP_CONTAINER_ID]: itemData
          .map((item) => {
            if (item.type === "collection" && item.collection)
              return `collection:${item.collection.id}`;
            if (item.type === "link" && item.link) return `link:${item.link.id}`;
            return null;
          })
          .filter((id): id is string => Boolean(id)),
      };

      for (const item of itemData) {
        if (item.type !== "collection" || !item.collection) continue;
        const collectionId = item.collection.id;
        const linkIds = linkData
          .filter((l) => l.collection_id === collectionId)
          .sort((a, b) => a.position - b.position)
          .map((l) => `link:${l.id}`);
        nextContainers[collectionContainerId(collectionId)] = linkIds;
      }

      containersRef.current = nextContainers;
      setContainers(nextContainers);
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
      else setError("Failed to load card editor.");
    } finally {
      if (!opts?.silent) setIsLoading(false);
    }
  }, [cardId]);

  useEffect(() => {
    void load();
  }, [load]);

  const previewItems = useMemo<PreviewItem[]>(() => {
    const top = containers[TOP_CONTAINER_ID] || [];
    if (!card) return [];

    const result: PreviewItem[] = [];
    for (const sortableId of top) {
      if (isLinkSortableId(sortableId)) {
        const link = linksById.get(parseLinkId(sortableId));
        if (link) result.push({ type: "link", link });
        continue;
      }

      if (isCollectionSortableId(sortableId)) {
        const collection = collectionsById.get(parseCollectionId(sortableId));
        if (!collection) continue;
        const linkIds = containers[collectionContainerId(collection.id)] || [];
        const collectionLinks = linkIds
          .map((id) => linksById.get(parseLinkId(id)))
          .filter((l): l is LinkType => Boolean(l));
        result.push({ type: "collection", collection, links: collectionLinks });
      }
    }
    return result;
  }, [card, collectionsById, containers, linksById]);

  const debouncedPreviewItems = useDebouncedValue(previewItems, 300);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  const collisionDetection: CollisionDetection = useCallback((args) => {
    const activeId = String(args.active.id);
    if (!isCollectionSortableId(activeId)) return closestCenter(args);

    const allowedIds = new Set<string>([
      TOP_CONTAINER_ID,
      ...(containersRef.current[TOP_CONTAINER_ID] || []),
    ]);

    return closestCenter({
      ...args,
      droppableContainers: args.droppableContainers.filter((c) =>
        allowedIds.has(String(c.id)),
      ),
    });
  }, []);

  async function persistReorder(nextContainers: Record<string, string[]>) {
    const top = nextContainers[TOP_CONTAINER_ID] || [];
    await apiFetch<void>(`/api/cards/${cardId}/items/reorder`, {
      method: "PATCH",
      json: {
        items: top.map((id, position) => {
          if (isCollectionSortableId(id)) {
            return { type: "collection", id: parseCollectionId(id), position };
          }
          return { type: "link", id: parseLinkId(id), position };
        }),
      },
    });
  }

  async function persistCollectionReorder(
    collectionId: string,
    linkSortableIds: string[],
  ) {
    await apiFetch<void>("/api/links/reorder", {
      method: "PATCH",
      json: {
        card_id: cardId,
        collection_id: collectionId,
        items: linkSortableIds.map((id, position) => ({
          id: parseLinkId(id),
          position,
        })),
      },
    });
  }

  async function persistDragChange(args: {
    activeId: string;
    startContainer: string;
    endContainer: string;
    nextContainers: Record<string, string[]>;
  }) {
    setError(null);
    setIsSyncingOrder(true);
    try {
      const { activeId, startContainer, endContainer, nextContainers } = args;

      if (isCollectionSortableId(activeId)) {
        await persistReorder(nextContainers);
        await load({ silent: true });
        return;
      }

      if (!isLinkSortableId(activeId)) return;
      const linkId = parseLinkId(activeId);

      const movedAcross = startContainer !== endContainer;
      if (movedAcross) {
        const nextCollectionId = endContainer.startsWith(COLLECTION_CONTAINER_PREFIX)
          ? endContainer.slice(COLLECTION_CONTAINER_PREFIX.length)
          : null;
        const moved = await apiFetch<LinkType>(`/api/links/${linkId}/move`, {
          method: "PATCH",
          json: { collection_id: nextCollectionId },
        });
        setLinks((prev) => prev.map((l) => (l.id === moved.id ? moved : l)));
      }

      const needsTopReorder =
        startContainer === TOP_CONTAINER_ID || endContainer === TOP_CONTAINER_ID;
      if (needsTopReorder) {
        await persistReorder(nextContainers);
      }

      if (startContainer.startsWith(COLLECTION_CONTAINER_PREFIX)) {
        const collectionId = startContainer.slice(COLLECTION_CONTAINER_PREFIX.length);
        await persistCollectionReorder(collectionId, nextContainers[startContainer] || []);
      }

      if (
        endContainer.startsWith(COLLECTION_CONTAINER_PREFIX) &&
        endContainer !== startContainer
      ) {
        const collectionId = endContainer.slice(COLLECTION_CONTAINER_PREFIX.length);
        await persistCollectionReorder(collectionId, nextContainers[endContainer] || []);
      }

      await load({ silent: true });
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
      else setError("Failed to save order. Refreshing…");
      await load({ silent: true });
    } finally {
      setIsSyncingOrder(false);
    }
  }

  function handleDragStart(event: DragStartEvent) {
    const activeId = String(event.active.id);
    const current = containersRef.current;
    dragStartContainerRef.current = findContainerForId(current, activeId);
  }

  function handleDragOver(event: DragOverEvent) {
    const over = event.over;
    if (!over) return;

    const activeId = String(event.active.id);
    const overId = String(over.id);
    if (!isLinkSortableId(activeId)) return;

    setContainers((prev) => {
      const activeContainer = findContainerForId(prev, activeId);
      const overContainer = resolveOverContainerId(prev, overId);
      if (!activeContainer || !overContainer) return prev;
      if (activeContainer === overContainer) return prev;

      const nextActiveItems = prev[activeContainer].filter((id) => id !== activeId);
      const overItems = prev[overContainer] || [];
      const cleanedOverItems = overItems.filter((id) => id !== activeId);

      const index = overItems.includes(overId)
        ? cleanedOverItems.indexOf(overId)
        : cleanedOverItems.length;

      const nextOverItems = [
        ...cleanedOverItems.slice(0, Math.max(index, 0)),
        activeId,
        ...cleanedOverItems.slice(Math.max(index, 0)),
      ];

      const nextState = {
        ...prev,
        [activeContainer]: nextActiveItems,
        [overContainer]: nextOverItems,
      };
      containersRef.current = nextState;
      return nextState;
    });
  }

  function handleDragEnd(event: DragEndEvent) {
    const over = event.over;
    if (!over) return;

    const activeId = String(event.active.id);
    const overId = String(over.id);
    const current = containersRef.current;

    const startContainer =
      dragStartContainerRef.current || findContainerForId(current, activeId);
    const endContainer = isCollectionSortableId(activeId)
      ? findContainerForId(current, overId)
      : resolveOverContainerId(current, overId);
    dragStartContainerRef.current = null;
    if (!startContainer || !endContainer) return;

    const activeContainer = findContainerForId(current, activeId);
    if (!activeContainer) return;

    let nextContainers = current;

    if (activeContainer === endContainer) {
      const containerItems = current[endContainer] || [];
      const fromIndex = containerItems.indexOf(activeId);
      const toIndex = overIndexForContainer(containerItems, overId);
      if (fromIndex !== -1 && toIndex !== -1 && fromIndex !== toIndex) {
        nextContainers = {
          ...current,
          [endContainer]: arrayMove(containerItems, fromIndex, toIndex),
        };
      }
    } else {
      const sourceItems = (current[activeContainer] || []).filter((id) => id !== activeId);
      const destItems = (current[endContainer] || []).filter((id) => id !== activeId);

      const toIndex = overId === endContainer ? destItems.length : destItems.indexOf(overId);
      const insertAt = toIndex === -1 ? destItems.length : toIndex;
      destItems.splice(insertAt, 0, activeId);

      nextContainers = {
        ...current,
        [activeContainer]: sourceItems,
        [endContainer]: destItems,
      };
    }

    setContainers(nextContainers);
    containersRef.current = nextContainers;
    void persistDragChange({ activeId, startContainer, endContainer, nextContainers });

    toast((t) => (
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium">Order saved</span>
        <button
          onClick={() => {
            setContainers(current);
            containersRef.current = current;
            void persistDragChange({
              activeId,
              startContainer: endContainer,
              endContainer: startContainer,
              nextContainers: current
            });
            toast.dismiss(t.id);
          }}
          className="rounded bg-black/10 px-2 py-1 text-xs font-semibold hover:bg-black/20 transition-colors"
        >
          Undo
        </button>
      </div>
    ), { duration: 4000 });
  }

  async function addTopLevelLink() {
    const title = newLinkTitle.trim();
    const url = newLinkUrl.trim();
    if (!title || !url) return;

    setIsAddingLink(true);
    setError(null);
    try {
      await apiFetch<LinkType>("/api/links", {
        method: "POST",
        json: { card_id: cardId, title, url },
      });
      setNewLinkTitle("");
      setNewLinkUrl("");
      await load({ silent: true });
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
      else setError("Failed to add link.");
    } finally {
      setIsAddingLink(false);
    }
  }

  async function addCollection() {
    const title = newCollectionTitle.trim();
    if (!title) return;

    setIsAddingCollection(true);
    setError(null);
    try {
      await apiFetch<Collection>("/api/collections", {
        method: "POST",
        json: { card_id: cardId, title },
      });
      setNewCollectionTitle("");
      await load({ silent: true });
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
      else setError("Failed to add collection.");
    } finally {
      setIsAddingCollection(false);
    }
  }

  if (isLoading) {
    return (
      <div className="rounded-3xl bg-white p-10 shadow-(--shadow-card) ring-1 ring-(--color-border)">
        <div className="flex items-center gap-3">
          <Spinner />
          <div className="text-sm font-semibold text-neutral-800">
            Loading card…
          </div>
        </div>
      </div>
    );
  }

  if (!card) {
    return (
      <div className="rounded-3xl bg-white p-6 text-sm text-neutral-800 shadow-(--shadow-card) ring-1 ring-(--color-border)">
        {error || "Card not found."}
      </div>
    );
  }

  const topSortableIds = containers[TOP_CONTAINER_ID] || [];

  return (
    <div className="flex min-w-0 flex-col gap-4">
      <div className="rounded-3xl bg-white p-6 shadow-(--shadow-card) ring-1 ring-(--color-border)">
        <h1
          className="text-2xl font-extrabold tracking-tight text-neutral-900"

        >
          {card.name}
        </h1>
        <p className="mt-2 text-sm text-neutral-700">
          Edit top-level links and collections for this card.
        </p>
        {isSyncingOrder ? (
          <div className="mt-3 text-xs font-semibold text-neutral-600">
            Saving order…
          </div>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_420px]">
        <div className="flex min-w-0 flex-col gap-6">
          {error && (
            <div className="rounded-3xl bg-red-50 p-4 text-sm text-red-700 ring-1 ring-red-100">
              {error}
            </div>
          )}

          <DndContext
            sensors={sensors}
            collisionDetection={collisionDetection}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
            onDragCancel={() => {
              dragStartContainerRef.current = null;
            }}
          >
            {topSortableIds.length === 0 ? (
              <div className="rounded-3xl bg-white p-6 text-sm text-neutral-700 shadow-(--shadow-card) ring-1 ring-(--color-border)">
                No items yet. Add a link or a collection below.
              </div>
            ) : (
              <DroppableArea
                id={TOP_CONTAINER_ID}
                className="flex flex-col gap-4"
              >
                <SortableContext
                  items={topSortableIds}
                  strategy={verticalListSortingStrategy}
                >
                  {topSortableIds.map((sortableId) => {
                    if (isLinkSortableId(sortableId)) {
                      const linkId = parseLinkId(sortableId);
                      const link = linksById.get(linkId);
                      if (!link) return null;
                      return (
                        <SortableWrapper key={sortableId} id={sortableId}>
                          {(dragHandle) => (
                            <LinkRow
                              link={link}
                              dragHandle={dragHandle}
                              onUpdated={(next) =>
                                setLinks((prev) =>
                                  prev.map((l) =>
                                    l.id === next.id ? next : l,
                                  ),
                                )
                              }
                              onDeleted={() => {
                                void load({ silent: true });
                              }}
                            />
                          )}
                        </SortableWrapper>
                      );
                    }

                    if (isCollectionSortableId(sortableId)) {
                      const collectionId = parseCollectionId(sortableId);
                      const collection = collectionsById.get(collectionId);
                      if (!collection) return null;

                      const containerId = collectionContainerId(collectionId);
                      const linkSortableIds = containers[containerId] || [];
                      const linkObjects = linkSortableIds
                        .map((id) => linksById.get(parseLinkId(id)))
                        .filter((l): l is LinkType => Boolean(l));

                      return (
                        <SortableWrapper key={sortableId} id={sortableId}>
                          {(dragHandle) => (
                            <CollectionEditor
                              collection={collection}
                              links={linkObjects}
                              dragHandle={dragHandle}
                              renderLinks={() => (
                                <DroppableArea
                                  id={containerId}
                                  className="flex flex-col gap-3"
                                >
                                  <SortableContext
                                    items={linkSortableIds}
                                    strategy={verticalListSortingStrategy}
                                  >
                                    {linkSortableIds.length === 0 ? (
                                      <div className="rounded-2xl bg-neutral-50 p-4 text-sm text-neutral-700 ring-1 ring-neutral-200">
                                        Drag links here
                                      </div>
                                    ) : (
                                      linkSortableIds.map((linkSortableId) => {
                                        const linkId = parseLinkId(linkSortableId);
                                        const link = linksById.get(linkId);
                                        if (!link) return null;
                                        return (
                                          <SortableWrapper
                                            key={linkSortableId}
                                            id={linkSortableId}
                                          >
                                            {(linkHandle) => (
                                              <LinkRow
                                                link={link}
                                                compact
                                                dragHandle={linkHandle}
                                                onUpdated={(next) =>
                                                  setLinks((prev) =>
                                                    prev.map((l) =>
                                                      l.id === next.id ? next : l,
                                                    ),
                                                  )
                                                }
                                                onDeleted={() => {
                                                  void load({ silent: true });
                                                }}
                                              />
                                            )}
                                          </SortableWrapper>
                                        );
                                      })
                                    )}
                                  </SortableContext>
                                </DroppableArea>
                              )}
                              onCollectionUpdated={(next) => {
                                setItems((prev) =>
                                  prev.map((it) =>
                                    it.type === "collection" &&
                                    it.collection?.id === next.id
                                      ? { ...it, collection: next }
                                      : it,
                                  ),
                                );
                              }}
                              onCollectionDeleted={() => {
                                void load({ silent: true });
                              }}
                              onLinkUpdated={(next) =>
                                setLinks((prev) =>
                                  prev.map((l) =>
                                    l.id === next.id ? next : l,
                                  ),
                                )
                              }
                              onLinkDeleted={() => {
                                void load({ silent: true });
                              }}
                              onLinkCreated={() => {
                                void load({ silent: true });
                              }}
                            />
                          )}
                        </SortableWrapper>
                      );
                    }

                    return null;
                  })}
                </SortableContext>
              </DroppableArea>
            )}
          </DndContext>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-3xl bg-white p-6 shadow-(--shadow-card) ring-1 ring-(--color-border)">
              <div className="text-sm font-bold text-neutral-900">Add link</div>
              <div className="mt-3 flex flex-col gap-3">
                <Input
                  value={newLinkTitle}
                  onChange={(e) => setNewLinkTitle(e.target.value)}
                  placeholder="Title"
                />
                <Input
                  value={newLinkUrl}
                  onChange={(e) => setNewLinkUrl(e.target.value)}
                  placeholder="https://…"
                />
                <Button
                  type="button"
                  onClick={addTopLevelLink}
                  disabled={isAddingLink}
                >
                  {isAddingLink ? "Adding…" : "Add link"}
                </Button>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-(--shadow-card) ring-1 ring-(--color-border)">
              <div className="text-sm font-bold text-neutral-900">
                Add collection
              </div>
              <div className="mt-3 flex flex-col gap-3">
                <Input
                  value={newCollectionTitle}
                  onChange={(e) => setNewCollectionTitle(e.target.value)}
                  placeholder="Collection title"
                />
                <Button
                  type="button"
                  onClick={addCollection}
                  disabled={isAddingCollection}
                >
                  {isAddingCollection ? "Adding…" : "Add collection"}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:sticky lg:top-6 lg:self-start">
          <PreviewFrame
            profile={{
              username: profile?.username || "",
              fullname: profile?.fullname || "",
              bio: profile?.bio || null,
              avatar_url: profile?.avatar_url || null,
            }}
            cardName={card.name}
            items={debouncedPreviewItems}
          />
        </div>
      </div>
    </div>
  );
}
