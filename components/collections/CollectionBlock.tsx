"use client";
import { useSortable, defaultAnimateLayoutChanges } from "@dnd-kit/sortable";
import { Collection, ItemFromList, Link as LinkType } from "@/lib/types";
import { CSS } from "@dnd-kit/utilities";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useContext } from "react";
import { AppContext } from "@/context/AppContext";
// import { Button } from "../ui/Button";
// import { apiFetch, ApiError } from "@/lib/api";
import { DraggableLink } from "../links/LinkRow";

export function CollectionBlock({ item }: { item: Collection }) {
  const { setSelectedCollection, setIsCreatingLink } = useContext(AppContext)!;
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

  return (
    <div
      style={style}
      ref={setNodeRef}
      className={[
        "rounded-3xl bg-neutral-100 flex-col gap-2 flex p-4 shadow-(--shadow-card) ring-1 ring-(--color-border)",
      ]
        .filter(Boolean)
        .join(" ")}
    >
        <div className="flex gap-4 justify-between">
          <button
            className="h-full w-10 cursor-grab text-sm text-gray-500"
            {...attributes}
            {...listeners}
          >
            ⠿
          </button>
          <p className="flex gap-1 flex-1 justify-center capitalize font-semibold text-neutral-600">
            {item.title}
            <Pencil className="w-4" />
          </p>
          <button
            className="text-md md:text-sm"
            onClick={() => {
              setIsCreatingLink(true);
              setSelectedCollection(item.id);
            }}
          >
            <Plus className="w-5" />
          </button>
          <button>
            <Trash2 className="w-4" />
          </button>
        </div>
        <div className="h-fit w-full py-2">
          {links.length > 0 ? (
            <div className="flex flex-col gap-2">
              {links.map((l, i) => (
                <DraggableLink inCollection={true} key={i} item={l} />
              ))}
            </div>
          ) : (
            <div className="flex gap-2 flex-col items-center justify-center p-3">
              <p className="md:text-lg text-sm font-semibold">
                Add a link to this collection
              </p>
              <button
                className="text-md md:text-sm ring-1 ring-neutral-300 p-2 py-1 bg-white rounded-full"
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
  );
}
