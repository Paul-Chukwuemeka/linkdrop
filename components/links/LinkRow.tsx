"use client";
import { useSortable, defaultAnimateLayoutChanges } from "@dnd-kit/sortable";
import { Link as LinkType } from "@/lib/types";
import { CSS } from "@dnd-kit/utilities";
import { Pencil, Trash2 } from "lucide-react";
import { useContext } from "react";
import { AppContext } from "@/context/AppContext";
import { Button } from "../ui/Button";
import { apiFetch, ApiError } from "@/lib/api";

export function DraggableLink({
  item,
  inCollection,
}: {
  item: LinkType;
  inCollection?: boolean;
}) {
  const { setError, loadCard, currentCard } = useContext(AppContext)!;

  async function deleteLink() {
    const ok = window.confirm("Delete this link?");
    if (!ok) return;
    setError(null);
    try {
      await apiFetch<void>(`/links/${item.id}`, { method: "DELETE" });
      loadCard(currentCard!.id);
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
      else setError("Failed to delete link.");
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
    <div
      style={style}
      ref={setNodeRef}
      className={[
        "rounded-lg sm:rounded-xl flex bg-white w-full items-center p-2 sm:p-3 md:p-4 py-2 shadow-(--shadow-card) ring-1 ring-(--color-border)",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <button
        hidden={inCollection}
        className="h-full w-8 sm:w-10 cursor-grab text-sm text-gray-500 shrink-0 touch-manipulation"
        {...attributes}
        {...listeners}
        aria-label="Drag to reorder"
      >
        ⠿
      </button>
      <div className="p-2 sm:p-3 flex flex-1 min-w-0 flex-col gap-1 sm:gap-1.5">
        <p className="flex gap-2 capitalize text-sm sm:text-base cursor-pointer font-semibold items-center">
          <span className="flex gap-1 items-center flex-1 min-w-0">
            <span className="truncate flex-1 min-w-0">{item.title}</span>
            <Pencil width={14} className="shrink-0 w-4 h-4" />
          </span>
          <button
            className="shrink-0 touch-manipulation p-1 rounded hover:bg-red-50 transition-colors"
            onClick={deleteLink}
            aria-label="Delete link"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </p>
        <p className="flex text-xs sm:text-sm gap-1 w-full min-w-0 font-medium cursor-pointer text-black/70 items-center">
          <span className="truncate min-w-0 flex-1">{item.url}</span>
          <Pencil width={14} className="shrink-0 w-4 h-4" />
        </p>
      </div>
    </div>
  );
}
