"use client";
import { useSortable, defaultAnimateLayoutChanges } from "@dnd-kit/sortable";
import type { Collection } from "@/lib/types";
import { CSS } from "@dnd-kit/utilities";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useContext, useState } from "react";
import { AppContext } from "@/context/AppContext";
import { apiFetch, ApiError } from "@/lib/api";
import { DraggableLink } from "../links/LinkRow";
import { UpdateCollection } from "@/components/collections/UpdateCollection";

export function CollectionBlock({ item }: { item: Collection }) {
  const { setSelectedCollection, setIsCreatingLink, currentCard, loadCard, setError } =
    useContext(AppContext)!;
  const [isEditing, setIsEditing] = useState(false);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: item.id,
    animateLayoutChanges: (args) =>
      args.isSorting || args.wasDragging
        ? defaultAnimateLayoutChanges(args)
        : false,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const links = item.links;

  async function deleteCollection() {
    const ok = window.confirm(
      "Delete this collection? This will also delete the links inside it.",
    );
    if (!ok) return;
    setError(null);
    try {
      await apiFetch<void>(`/collections/${item.id}`, { method: "DELETE" });
      if (currentCard?.id) void loadCard(currentCard.id);
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
      else setError("Failed to delete collection.");
    }
  }

  return (
    <>
      <div
        style={style}
        ref={setNodeRef}
        className={[
          "flex flex-col gap-2 rounded-xl bg-neutral-100 p-3 shadow-(--shadow-card) ring-1 ring-(--color-border) sm:gap-3 sm:rounded-2xl sm:p-4",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <div className="flex gap-2 sm:gap-4 justify-between items-center">
          <button
            className="h-10 w-8 sm:w-10 cursor-grab text-sm text-gray-500 shrink-0 touch-manipulation"
            {...attributes}
            {...listeners}
            aria-label="Drag to reorder"
          >
            ⠿
          </button>
          <p
            className="flex flex-1 cursor-pointer justify-center gap-1 text-sm font-semibold capitalize text-neutral-600 sm:text-base"
            onClick={() => setIsEditing(true)}
          >
            <span className="truncate">{item.title}</span>
            <Pencil className="w-4 h-4 shrink-0" />
          </p>
          <button
            className="p-2 rounded-full hover:bg-white/50 transition-colors touch-manipulation"
            onClick={() => {
              setIsCreatingLink(true);
              setSelectedCollection(item.id);
            }}
            aria-label="Add link to collection"
          >
            <Plus className="w-5 h-5" />
          </button>
          <button
            className="p-2 rounded-full hover:bg-red-50 transition-colors touch-manipulation"
            aria-label="Delete collection"
            onClick={deleteCollection}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
        <div className="h-fit w-full py-2">
          {links.length > 0 ? (
            <div className="flex flex-col gap-2 sm:gap-3">
              {links.map((l, i) => (
                <DraggableLink inCollection={true} key={i} item={l} />
              ))}
            </div>
          ) : (
            <div className="flex gap-2 flex-col items-center justify-center p-3 sm:p-4">
              <p className="text-sm sm:text-base font-semibold text-center">
                Add a link to this collection
              </p>
              <button
                className="text-sm ring-1 ring-neutral-300 px-4 py-2 bg-white rounded-full hover:bg-neutral-50 transition-colors touch-manipulation"
                onClick={() => {
                  setIsCreatingLink(true);
                  setSelectedCollection(item.id);
                }}
              >
                Add link
              </button>
            </div>
          )}
        </div>
      </div>
      {isEditing ? (
        <UpdateCollection
          collection={item}
          onClose={() => setIsEditing(false)}
        />
      ) : null}
    </>
  );
}
