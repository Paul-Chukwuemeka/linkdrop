"use client";

import { LinkRow } from "@/components/links/LinkRow";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { apiFetch, ApiError } from "@/lib/api";
import type { Collection, Link as LinkType } from "@/lib/types";
import { Folder, GripVertical, Plus } from "lucide-react";
import React, { useMemo, useRef, useState } from "react";

export function CollectionEditor({
  collection,
  links,
  onCollectionUpdated,
  onCollectionDeleted,
  onLinkUpdated,
  onLinkDeleted,
  onLinkCreated,
  dragHandle,
  renderLinks,
}: {
  collection: Collection;
  links: LinkType[];
  onCollectionUpdated: (next: Collection) => void;
  onCollectionDeleted: (id: string) => void;
  onLinkUpdated: (next: LinkType) => void;
  onLinkDeleted: (id: string) => void;
  onLinkCreated: (next: LinkType) => void;
  dragHandle?: { attributes: unknown; listeners: unknown };
  renderLinks?: () => React.ReactNode;
}) {
  const [title, setTitle] = useState(collection.title);
  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const saving = useRef(false);

  const nestedInputClassName =
    "rounded-2xl bg-neutral-50 shadow-none ring-neutral-200 focus:ring-[var(--accent)]";

  const sortedLinks = useMemo(() => {
    return [...links].sort((a, b) => a.position - b.position);
  }, [links]);

  async function saveTitle(nextTitle: string) {
    if (saving.current) return;
    saving.current = true;
    setError(null);
    try {
      const updated = await apiFetch<Collection>(`/api/collections/${collection.id}`, {
        method: "PATCH",
        json: { title: nextTitle },
      });
      onCollectionUpdated(updated);
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
      else setError("Failed to update collection.");
    } finally {
      saving.current = false;
    }
  }

  async function deleteCollection() {
    const ok = window.confirm(
      "Delete this collection? This will also delete the links inside it.",
    );
    if (!ok) return;

    setError(null);
    try {
      await apiFetch<void>(`/api/collections/${collection.id}`, { method: "DELETE" });
      onCollectionDeleted(collection.id);
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
      else setError("Failed to delete collection.");
    }
  }

  async function createLink() {
    const titleTrimmed = newTitle.trim();
    const urlTrimmed = newUrl.trim();
    if (!titleTrimmed || !urlTrimmed) return;

    setError(null);
    try {
      const created = await apiFetch<LinkType>("/api/links", {
        method: "POST",
        json: {
          card_id: collection.card_id,
          collection_id: collection.id,
          title: titleTrimmed,
          url: urlTrimmed,
        },
      });
      setNewTitle("");
      setNewUrl("");
      onLinkCreated(created);
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
      else setError("Failed to create link.");
    }
  }

  return (
    <div className="rounded-3xl bg-white dark:bg-neutral-900 p-5 shadow-[var(--shadow-card)] ring-1 ring-(--border-color)">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-neutral-600">
            <Folder className="h-4 w-4" aria-hidden="true" />
            <span>Collection</span>
            <span className="ml-auto inline-flex items-center rounded-full bg-neutral-50 px-2 py-0.5 text-[11px] font-semibold text-neutral-700 ring-1 ring-neutral-200">
              {sortedLinks.length} link{sortedLinks.length === 1 ? "" : "s"}
            </span>
          </div>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Collection title"
            className={nestedInputClassName}
            onBlur={() => {
              const next = title.trim();
              if (next && next !== collection.title) void saveTitle(next);
              else setTitle(collection.title);
            }}
            aria-label="Collection title"
          />
        </div>
        <div className="flex items-center gap-2">
          {dragHandle ? (
            <button
              type="button"
              className="inline-flex h-11 w-11 cursor-grab items-center justify-center rounded-2xl bg-neutral-50 text-neutral-700 ring-1 ring-neutral-200 hover:bg-neutral-100 active:cursor-grabbing"
              aria-label="Drag collection"
              {...(dragHandle.attributes as React.HTMLAttributes<HTMLButtonElement>)}
              {...(dragHandle.listeners as React.HTMLAttributes<HTMLButtonElement>)}
            >
              <GripVertical className="h-5 w-5" aria-hidden="true" />
            </button>
          ) : null}
          <Button
            variant="danger"
            size="sm"
            className="rounded-2xl"
            type="button"
            onClick={deleteCollection}
          >
            Delete
          </Button>
        </div>
      </div>

      <div className="mt-5 rounded-3xl bg-neutral-50/70 p-4 ring-1 ring-neutral-200">
        <div className="flex flex-col gap-3">
          {renderLinks ? (
            renderLinks()
          ) : sortedLinks.length === 0 ? (
            <div className="rounded-2xl bg-white/70 p-4 text-sm text-neutral-700 ring-1 ring-neutral-200">
              No links in this collection yet.
            </div>
          ) : (
            sortedLinks.map((link) => (
              <LinkRow
                key={link.id}
                link={link}
                onUpdated={onLinkUpdated}
                onDeleted={onLinkDeleted}
                compact
              />
            ))
          )}
        </div>
      </div>

      <div className="mt-6 rounded-3xl bg-neutral-50 p-5 ring-1 ring-neutral-200">
        <div className="flex items-center gap-2 text-sm font-bold text-neutral-900">
          <Plus className="h-4 w-4" aria-hidden="true" />
          <span>Add a link</span>
        </div>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-center">
          <Input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Title"
            className={nestedInputClassName}
          />
          <Input
            value={newUrl}
            type="url"
            onChange={(e) => setNewUrl(e.target.value)}
            placeholder="https://…"
            className={nestedInputClassName}
          />
          <Button type="button" size="sm" className="rounded-2xl" onClick={createLink}>
            Add
          </Button>
        </div>
      </div>

      {error ? (
        <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700 ring-1 ring-red-100">
          {error}
        </div>
      ) : null}
    </div>
  );
}
