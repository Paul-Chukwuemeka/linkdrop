"use client";
import { useSortable, defaultAnimateLayoutChanges } from "@dnd-kit/sortable";
import { Link as LinkType } from "@/lib/types";
import { CSS } from "@dnd-kit/utilities";
import { FolderInput, Loader2, Pencil, Trash2 } from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useCard } from "@/context/CardContext";
import { apiFetch, ApiError } from "@/lib/api";
import { UpdateLink } from "@/components/links/UpdateLink";
import { ConfirmModal } from "@/components/ui/ConfirmModal";

export function DraggableLink({
  item,
}: {
  item: LinkType;
  inCollection?: boolean;
}) {
  const { setCardError: setError, loadCard, currentCard, moveLink } = useCard();
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const moveTargets = useMemo(() => {
    const collections = currentCard?.items_list.filter(
      (i): i is Extract<typeof i, { type: "collection" }> => i.type === "collection",
    );
    const targets: { id: string | null; label: string }[] = [];
    if (item.collection_id != null) targets.push({ id: null, label: "Main page" });
    collections?.forEach((c) => {
      if (c.content.id !== item.collection_id) {
        targets.push({ id: c.content.id, label: c.content.title });
      }
    });
    return targets;
  }, [currentCard, item.collection_id]);

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
  async function executeMoveLink(targetId: string | null) {
    setIsMoving(true);
    try {
      await moveLink(item.id, targetId);
      setMenuOpen(false);
    } finally {
      setIsMoving(false);
    }
  }

  useEffect(() => {
    if (!menuOpen) return;
    function onPointerDown(e: MouseEvent | TouchEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

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
          className="h-full w-8 shrink-0 cursor-grab text-sm text-gray-500 dark:text-gray-400 touch-manipulation sm:w-10"
          {...attributes}
          {...listeners}
          aria-label="Drag to reorder"
        >
          ⠿
        </button>
        <div className="flex min-w-0 flex-1 flex-col gap-1 p-2 sm:gap-1.5 sm:p-3">
          <div
            className="flex cursor-pointer items-center gap-2 text-sm font-semibold capitalize sm:text-base dark:text-neutral-100"
            onClick={() => setIsEditing(true)}
          >
            <span className="flex min-w-0 flex-1 items-center gap-2">
              <span className="min-w-0  truncate">{item.title}</span>
              <Pencil width={14} className="h-4 w-4 shrink-0" />
            </span>
            {moveTargets.length > 0 && (
              <span
                ref={menuRef}
                className="relative shrink-0"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="rounded p-1 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-700 touch-manipulation"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen((open) => !open);
                  }}
                  aria-label="Move to collection"
                  aria-haspopup="menu"
                  aria-expanded={menuOpen}
                  disabled={isMoving}
                >
                  {isMoving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <FolderInput className="h-4 w-4" />
                  )}
                </button>
                {menuOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 top-full mt-2 z-20 min-w-40 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 shadow-lg overflow-hidden"
                  >
                    {moveTargets.map((target) => (
                      <button
                        key={target.id ?? "main"}
                        role="menuitem"
                        className="w-full flex items-center gap-2 px-3 py-2.5 text-left text-sm text-neutral-900 dark:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          void executeMoveLink(target.id);
                        }}
                      >
                        <span className="min-w-0 truncate">{target.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </span>
            )}
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
          </div>
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
