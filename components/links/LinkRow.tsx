"use client";
import { useSortable, defaultAnimateLayoutChanges } from "@dnd-kit/sortable";
import { Link as LinkType } from "@/lib/types";
import { CSS } from "@dnd-kit/utilities";
import { Pencil, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { useCard } from "@/context/CardContext";
import { apiFetch, ApiError } from "@/lib/api";
import { UpdateLink } from "@/components/links/UpdateLink";
import { ConfirmModal } from "@/components/ui/ConfirmModal";

export function DraggableLink({
  item,
  inCollection,
}: {
  item: LinkType;
  inCollection?: boolean;
}) {
  const { setCardError: setError, loadCard, currentCard } = useCard();
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function executeDeleteLink() {
    setError(null);
    setIsDeleting(true);
    try {
      await apiFetch<void>(`/api/links/${item.id}`, { method: "DELETE" });
      if (currentCard?.id) void loadCard(currentCard.id);
      setIsConfirmOpen(false);
    } catch (err) {
      setIsConfirmOpen(false);
      if (err instanceof ApiError) setError(err.message);
      else setError("Failed to delete link.");
    } finally {
      setIsDeleting(false);
    }
  }
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
  return (
    <>
      <div
        style={style}
        ref={setNodeRef}
        className={[
          "flex w-full items-center rounded-lg bg-white dark:bg-neutral-900 p-2 py-2 shadow-(--shadow-card) ring-1 ring-(--border-color) sm:rounded-xl sm:p-3 md:p-4",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <button
          hidden={inCollection}
          className="h-full w-8 shrink-0 cursor-grab text-sm text-gray-500 dark:text-gray-400 touch-manipulation sm:w-10"
          {...attributes}
          {...listeners}
          aria-label="Drag to reorder"
        >
          ⠿
        </button>
        <div className="flex min-w-0 flex-1 flex-col gap-1 p-2 sm:gap-1.5 sm:p-3">
          <p
            className="flex cursor-pointer items-center gap-2 text-sm font-semibold capitalize sm:text-base dark:text-neutral-100"
            onClick={() => setIsEditing(true)}
          >
            <span className="flex min-w-0 flex-1 items-center gap-2">
              <span className="min-w-0  truncate">{item.title}</span>
              <Pencil width={14} className="h-4 w-4 shrink-0" />
            </span>
            <button
              className="shrink-0 rounded p-1 transition-colors hover:bg-red-50 dark:hover:bg-red-900/30 touch-manipulation"
              onClick={(e) => {
                e.stopPropagation();
                setIsConfirmOpen(true);
              }}
              aria-label="Delete link"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </p>
          <p
            className="flex w-full min-w-0 cursor-pointer items-center gap-1 text-xs font-medium text-black/70 dark:text-white/70 sm:text-sm"
            onClick={() => setIsEditing(true)}
          >
            <span className="min-w-0 flex-1 truncate">{item.url}</span>
            <Pencil width={14} className="shrink-0" />
          </p>
        </div>
      </div>
      {isEditing ? (
        <UpdateLink link={item} onClose={() => setIsEditing(false)} />
      ) : null}
      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={executeDeleteLink}
        title="Delete Link"
        message="Are you sure you want to permanently delete this link?"
        isPending={isDeleting}
      />
    </>
  );
}
