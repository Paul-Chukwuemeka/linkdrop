"use client";
import { useSortable, defaultAnimateLayoutChanges } from "@dnd-kit/sortable";
import { Link as LinkType } from "@/lib/types";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Pencil, Trash2 } from "lucide-react";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useCard } from "@/context/CardContext";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { apiFetch, ApiError } from "@/lib/api";
import { isValidUrl } from "@/utils/validate";
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

  async function executeDeleteLink() {
    setError(null);
    try {
      await apiFetch<void>(`/api/links/${item.id}`, { method: "DELETE" });
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
      />
    </>
  );
}

export function LinkRow({
  link,
  onUpdated,
  onDeleted,
  compact,
  dragHandle,
}: {
  link: LinkType;
  onUpdated: (next: LinkType) => void;
  onDeleted?: (id: string) => void;
  compact?: boolean;
  dragHandle?: { attributes: unknown; listeners: unknown };
}) {
  const [title, setTitle] = useState(link.title);
  const [url, setUrl] = useState(link.url);
  const [error, setError] = useState<string | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const saving = useRef(false);

  useEffect(() => {
    setTitle(link.title);
    setUrl(link.url);
  }, [link.id, link.title, link.url]);

  const nestedInputClassName =
    "rounded-2xl bg-neutral-50 dark:bg-neutral-800 shadow-none ring-neutral-200 dark:ring-neutral-700 focus:ring-[var(--accent)]";

  async function savePatch(patch: Partial<Pick<LinkType, "title" | "url">>) {
    if (saving.current) return;
    saving.current = true;
    setError(null);
    try {
      const updated = await apiFetch<LinkType>(`/api/links/${link.id}`, {
        method: "PATCH",
        json: patch,
      });
      onUpdated(updated);
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
      else setError("Failed to update link.");
    } finally {
      saving.current = false;
    }
  }

  async function executeDeleteLink() {
    setError(null);
    try {
      await apiFetch<void>(`/api/links/${link.id}`, { method: "DELETE" });
      onDeleted?.(link.id);
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
      else setError("Failed to delete link.");
    }
  }

  return (
    <div
      className={[
        "rounded-3xl bg-white dark:bg-neutral-900 shadow-(--shadow-card) ring-1 ring-(--border-color)",
        compact ? "p-3" : "p-4",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex items-start gap-3">
        {dragHandle ? (
          <button
            type="button"
            className="inline-flex h-11 w-11 cursor-grab items-center justify-center rounded-2xl bg-neutral-50 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 ring-1 ring-neutral-200 dark:ring-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-700 active:cursor-grabbing"
            aria-label="Drag link"
            {...(dragHandle.attributes as React.HTMLAttributes<HTMLButtonElement>)}
            {...(dragHandle.listeners as React.HTMLAttributes<HTMLButtonElement>)}
          >
            <GripVertical className="h-5 w-5" aria-hidden="true" />
          </button>
        ) : null}

        <div className="min-w-0 flex-1">
          <div className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">Link</div>
          <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              className={nestedInputClassName}
              onBlur={() => {
                const next = title.trim();
                if (next && next !== link.title) void savePatch({ title: next });
                else setTitle(link.title);
              }}
              aria-label="Link title"
            />
            <Input
              value={url}
              type="url"
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://…"
              className={nestedInputClassName}
              onBlur={() => {
                const next = url.trim();
                if (!next) {
                  setUrl(link.url);
                  return;
                }
                if (!isValidUrl(next)) {
                  setError("Please enter a valid URL.");
                  setUrl(link.url);
                  return;
                }
                if (next !== link.url) void savePatch({ url: next });
              }}
              aria-label="Link URL"
            />
          </div>
        </div>

        <Button
          variant="danger"
          size="sm"
          className="rounded-2xl"
          type="button"
          onClick={() => setIsConfirmOpen(true)}
        >
          Delete
        </Button>
      </div>

      {error ? (
        <div className="mt-3 rounded-xl bg-red-50 dark:bg-red-900/30 p-3 text-sm text-red-700 dark:text-red-300 ring-1 ring-red-100 dark:ring-red-800/50">
          {error}
        </div>
      ) : null}
      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={executeDeleteLink}
        title="Delete Link"
        message="Are you sure you want to permanently delete this link?"
      />
    </div>
  );
}
