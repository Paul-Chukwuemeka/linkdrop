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
        "rounded-lg flex bg-white items-center p-4 py-2 shadow-(--shadow-card) ring-1 ring-(--color-border)",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <button
        hidden={inCollection}
        className="h-full w-10 cursor-grab text-sm text-gray-500"
        {...attributes}
        {...listeners}
      >
        ⠿
      </button>
      <div className="p-3 flex flex-1 flex-col gap-1.5">
        <p className="flex gap-1 capitalize cursor-pointer font-semibold items-center text-md">
          <span className="flex gap-1 items-center flex-1">
            {item.title}
            <Pencil width={15} />
          </span>
          <button onClick={deleteLink}>
            <Trash2 className="w-4" />
          </button>
        </p>
        <p className="flex gap-1 font-medium cursor-pointer text-black/70 items-center text-sm">
          {item.url} <Pencil width={15} />
        </p>
      </div>
    </div>
  );
}
