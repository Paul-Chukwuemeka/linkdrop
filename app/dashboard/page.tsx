"use client";
import { useMemo, useState } from "react";
import { useCard } from "@/context/CardContext";
import { useProfile } from "@/context/ProfileContext";
import { PenLine, Plus, FolderPlus, Loader2 } from "lucide-react";
import Link from "next/link";
import CardPreview from "@/components/cards/CardPreview";
import { ButtonLoader } from "@/components/ui/ButtonLoader";
import { apiFetch } from "@/lib/api";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
import { ItemFromList } from "@/lib/types";
import { DraggableLink } from "../../components/links/LinkRow";
import { CreateLink } from "@/components/links/CreateLink";
import { CreateCollection } from "@/components/collections/CreateCollection";
import { CollectionBlock } from "@/components/collections/CollectionBlock";
import { CardSwitcher } from "@/components/cards/CardSwitcher";

export default function DashboardPage() {
  const { profile, profileError } = useProfile();
  const {
    currentCard,
    setCurrentCard,
    loadCard,
    isLoadingCard,
    isLoadingReorder,
    setIsLoadingReorder,
    isCreatingLink,
    isCreatingCollection,
    setIsCreatingCollection,
    setIsCreatingLink,
    cardError,
    setCardError,
    renameCard,
  } = useCard();
  const { setProfile } = useProfile();

  const error = cardError || profileError;
  const setError = setCardError;

  const [activeId, setActiveId] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [isSettingMain, setIsSettingMain] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor));

  function handleDragStart(e: DragStartEvent) {
    setActiveId(e.active.id as string);
  }

  const items = useMemo(() => {
    return currentCard?.items_list || null;
  }, [currentCard]);

  async function handleDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!items || !currentCard) return;
    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((i) => i.content.id === active.id);
      const newIndex = items.findIndex((i) => i.content.id === over.id);
      if (oldIndex < 0 || newIndex < 0) return;

      const reordered: ItemFromList[] = arrayMove(
        items,
        oldIndex,
        newIndex,
      ).map((item, index) => ({
        ...item,
        position: index + 1,
      }));

      const previousCard = { ...currentCard };
      setCurrentCard({
        ...currentCard,
        items_list: reordered,
      });

      setIsLoadingReorder(true);
      try {
        await handleReorder(currentCard.id, reordered);
      } catch (err) {
        console.error("Failed to reorder items:", err);
        setError("Failed to save new order. Reverting...");
        setCurrentCard(previousCard);
      } finally {
        setIsLoadingReorder(false);
      }
    }
  }

  const activeItem =
    currentCard &&
    currentCard.items_list.find((item) => item.content.id === activeId);

  async function updateCurrentCard(id: string) {
    setIsSettingMain(true);
    try {
      await apiFetch("/api/profile/current", {
        method: "PATCH",
        json: { card_id: id },
      });
      setProfile((prev) => prev ? { ...prev, current_card: id } : prev);
      loadCard(id);
    } catch {
      setError("Failed to update current card");
    } finally {
      setIsSettingMain(false);
    }
  }

  const handleRename = async () => {
    if (!editedName.trim() || editedName === currentCard?.name) {
      setIsEditingName(false);
      return;
    }
    await renameCard(editedName);
    setIsEditingName(false);
  };

  return (
    <div className="flex min-w-0 flex-col h-full gap-2 sm:gap-3 lg:gap-4">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 p-4 text-sm text-red-700 dark:text-red-300  ring-red-100 dark:ring-red-800/50">
          {error}
        </div>
      )}
      {currentCard === null && !isLoadingCard && (
        <div className="flex flex-col items-center justify-center rounded-xl bg-white dark:bg-neutral-900 p-12 text-center">
          <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">No cards yet</h3>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
            Create your first card to start adding links.
          </p>
          <Link
            href="/dashboard/cards"
            className="mt-6 rounded-full bg-black dark:bg-white dark:text-black px-6 py-2 text-sm font-bold text-white hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
          >
            Create your first card
          </Link>
        </div>
      )}
      <div className="flex-1 gap-1 md:gap-4 items-center w-full overflow-auto flex justify-center rounded-xl">
        <div className="overflow-auto rounded-xl bg-white dark:bg-neutral-900 flex justify-center flex-1 w-full p-3 sm:p-4 md:p-6 h-full">
          <div className="max-w-200 w-full h-fit shrink-0 flex flex-col gap-3 sm:gap-4">
            {currentCard && (
              <>
              <div className="flex px-1 items-center justify-between">
              {isEditingName ? (
                <input
                  autoFocus
                  className="text-xl flex-1 sm:text-2xl mb-1 font-semibold outline-none border-b-2 border-black dark:border-white bg-transparent text-neutral-900 dark:text-neutral-100 w-full mr-4"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  onBlur={handleRename}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleRename();
                    if (e.key === "Escape") setIsEditingName(false);
                  }}
                />
              ) : (
                <h2
                  className="text-xl tracking-wider capitalize sm:text-2xl mb-1 flex items-center gap-1 font-semibold cursor-pointer group dark:text-neutral-100"
                  onClick={() => {
                    setEditedName(currentCard?.name || "");
                    setIsEditingName(true);
                  }}
                >
                  {currentCard?.name}{" "}
                  <PenLine className="w-4 transition-transform group-hover:scale-110" />
                </h2>
              )}
              <div className="flex items-center gap-1">
              {(isLoadingCard || isLoadingReorder) && (
                <Loader2
                  className="h-4 w-4 animate-spin shrink-0 text-neutral-500 dark:text-neutral-400"
                  aria-label="Loading card"
                />
              )}
              {profile && currentCard?.id !== profile!.current_card && (
                <button
                  onClick={() => updateCurrentCard(currentCard!.id)}
                  disabled={isSettingMain}
                  className="shadow-(--shadow-card) font-bold text-(--accent-foreground) w-30 h-9 bg-(--accent) px-3 rounded-full text-xs md:text-md disabled:opacity-50"
                >
                  {isSettingMain ? <ButtonLoader label="Saving…" /> : "Set as main card"}
                </button>
              )}
              <CardSwitcher />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <button
                className="w-full inline-flex items-center justify-center gap-2 bg-[#1B3A1B] text-white font-medium py-3 px-4 rounded-xl hover:bg-[#2A502A] active:scale-[0.98] transition-all"
                onClick={() => {
                  setIsCreatingLink(true);
                }}
              >
                <Plus className="w-4 h-4" />
                Add link
              </button>
              <button
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 dark:border-neutral-700 py-2.5 px-4 text-sm font-medium text-gray-600 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
                onClick={() => {
                  setIsCreatingCollection(true);
                }}
              >
                <FolderPlus className="w-4 h-4" />
                Create a new collection
              </button>
            </div>
            {isCreatingLink && <CreateLink />}
            {isCreatingCollection && <CreateCollection />}
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={currentCard.items_list.map((item) => item.content.id)}
                strategy={verticalListSortingStrategy}
              >
                {currentCard.items_list.map((item) => {
                  return item.type == "link" ? (
                    <DraggableLink key={item.content.id} item={item.content} />
                  ) : (
                    <CollectionBlock key={item.content.id} item={item.content} />
                  );
                })}
              </SortableContext>
              <DragOverlay>
                {activeItem &&
                  (activeItem.type == "link" ? (
                    <DraggableLink item={activeItem.content} />
                  ) : (
                    <CollectionBlock item={activeItem.content} />
                  ))}
              </DragOverlay>
            </DndContext>
              </>
            )}
          </div>
        </div>
        <div
          className="hidden lg:flex bg-gray-100 dark:bg-neutral-800/60 rounded-2xl border border-gray-200 dark:border-neutral-700 p-6 items-center justify-center h-full"
        >
          <div className="w-full">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Preview
            </h3>
            <div className="mx-auto w-fit bg-white rounded-[2rem] border-6 border-gray-200 dark:border-neutral-700 shadow-xl p-2">
              <CardPreview />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

async function handleReorder(card_id: string, reordered: ItemFromList[]) {
  const items = reordered.map((item) => ({
    type: item.type,
    id: item.content.id,
    position: item.position,
  }));
  const res = await apiFetch(`/api/cards/${card_id}/reorder`, {
    method: "PATCH",
    json: {
      items,
    },
  });
  return res;
}


