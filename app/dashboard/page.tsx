"use client";
import { SetStateAction, useContext, useMemo, useState } from "react";
import { useCard } from "@/context/CardContext";
import { useProfile } from "@/context/ProfileContext";
import { PenLine, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import CardPreview from "@/components/cards/CardPreview";
import { ProfileHeaderBar } from "@/components/dashboard/ProfileHeaderBar";
import { OptionsDropdown } from "@/components/dashboard/OptionsDropdown";
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
import { signOut } from "next-auth/react";

export default function DashboardPage() {
  const { profile, profileError } = useProfile();
  const {
    currentCard,
    setCurrentCard,
    loadCard,
    isLoadingCard,
    isCreatingLink,
    isCreatingCollection,
    setIsCreatingCollection,
    setIsCreatingLink,
    cardError,
    setCardError,
    renameCard,
  } = useCard();

  const error = cardError || profileError;
  const setError = setCardError;

  const logout = () => signOut({ callbackUrl: "/login" });

  const [options, setOptions] = useState(false);
  const [activeId, setActiveId] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState("");

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

      try {
        await handleReorder(currentCard.id, reordered);
      } catch (err) {
        console.error("Failed to reorder items:", err);
        setError("Failed to save new order. Reverting...");
        setCurrentCard(previousCard);
      }
    }
  }

  const activeItem =
    currentCard &&
    currentCard.items_list.find((item) => item.content.id === activeId);

  async function updateCurrentCard(id: string) {
    try {
      await apiFetch("/api/profile/current", {
        method: "PATCH",
        json: { card_id: id },
      });
      loadCard(id);
    } catch (error) {
      setError("Failed to update current card");
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
      <ProfileHeaderBar profile={profile} logout={logout} />
      {error && (
        <div className="bg-red-50 p-4 text-sm text-red-700 ring-1 ring-red-100">
          {error}
        </div>
      )}
      {currentCard === null && !isLoadingCard && (
        <div className="flex flex-col items-center justify-center rounded-xl bg-white p-12 text-center">
          <h3 className="text-lg font-semibold text-neutral-800">No cards yet</h3>
          <p className="mt-2 text-sm text-neutral-600">
            Create your first card to start adding links.
          </p>
          <Link
            href="/dashboard/cards"
            className="mt-6 rounded-full bg-black px-6 py-2 text-sm font-bold text-white hover:bg-neutral-800 transition-colors"
          >
            Create your first card
          </Link>
        </div>
      )}
      <div className="flex-1 gap-1 md:gap-4 items-center w-full overflow-auto flex justify-center rounded-xl">
        <div className="overflow-auto rounded-xl bg-white flex justify-center flex-1 w-full p-3 sm:p-4 md:p-6 h-full">
          <div className="max-w-200 w-full h-fit shrink-0 flex flex-col gap-3 sm:gap-4">
            {currentCard && (
              <>
              <div className="flex px-1 items-center justify-between">
              {isEditingName ? (
                <input
                  autoFocus
                  className="text-xl flex-1 sm:text-2xl mb-1 font-semibold outline-none border-b-2 border-black w-full mr-4"
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
                  className="text-xl tracking-wider capitalize sm:text-2xl mb-1 flex items-center gap-1 font-semibold cursor-pointer group"
                  onClick={() => {
                    setEditedName(currentCard?.name || "");
                    setIsEditingName(true);
                  }}
                >
                  {currentCard?.name}{" "}
                  <PenLine className="w-4 transition-transform group-hover:scale-110" />
                </h2>
              )}
              {profile && currentCard?.id !== profile!.current_card && (
                <button
                  onClick={() => updateCurrentCard(currentCard!.id)}
                  className="shadow-(--shadow-card) font-bold text-white w-30 h-9 bg-black px-3 rounded-full text-xs md:text-md"
                >
                  Set as main card
                </button>
              )}
            </div>
            <div className="flex relative rounded-2xl sm:rounded-3xl items-center w-full border bg-black text-white h-11 sm:h-12">
              <button
                className="flex-1 h-full rounded-2xl sm:rounded-3xl text-sm sm:text-base font-medium"
                onClick={() => {
                  setIsCreatingLink(true);
                }}
              >
                Add a new Link
              </button>
              <button
                className="border-l rounded-l-none  h-full border-gray-400 cursor-pointer px-3 sm:px-4 touch-manipulation"
                onClick={() => {
                  setOptions(!options);
                }}
                aria-label="More options"
              >
                {options ? (
                  <ChevronUp className="w-5" />
                ) : (
                  <ChevronDown className="w-5" />
                )}
                {options && (
                  <OptionsDropdown
                    setOptions={setOptions}
                    setIsCreatingCollection={setIsCreatingCollection}
                  />
                )}
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
          className="md:p-2 hidden lg:flex bg-white p-2 items-center justify-center rounded-xl h-full"
        >
          <CardPreview />
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


