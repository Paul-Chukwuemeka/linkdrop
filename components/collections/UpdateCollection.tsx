"use client";

import { useCard } from "@/context/CardContext";
import { apiFetch, ApiError } from "@/lib/api";
import type { Collection } from "@/lib/types";
import { Folder, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { ButtonLoader } from "../ui/ButtonLoader";

export function UpdateCollection({
  collection,
  onClose,
}: {
  collection: Collection;
  onClose: () => void;
}) {
  const { currentCard, loadCard, setCardError: setError } = useCard();
  const [title, setTitle] = useState(collection.title);
  const [isSaving, setIsSaving] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const nestedInputClassName =
    "rounded-xl bg-neutral-50 dark:bg-neutral-800 shadow-none ring-neutral-200 dark:ring-neutral-700 focus:ring-[var(--accent)]";

  function close() {
    if (isSaving) return;
    onClose();
  }

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && !isSaving) onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isSaving, onClose]);

  async function save() {
    const nextTitle = title.trim();
    if (!nextTitle) {
      setLocalError("Title is required.");
      return;
    }

    setLocalError(null);
    setError(null);
    setIsSaving(true);
    try {
      await apiFetch<Collection>(`/api/collections/${collection.id}`, {
        method: "PATCH",
        json: { title: nextTitle },
      });
      if (currentCard?.id) void loadCard(currentCard.id);
      onClose();
    } catch (err) {
      if (err instanceof ApiError) setLocalError(err.message);
      else setLocalError("Failed to update collection.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      onClick={close}
    >
      <form
        className="w-full max-w-md rounded-2xl bg-white dark:bg-neutral-900 p-4 shadow-(--shadow-card) ring-1 ring-(--border-color) sm:p-6"
        onClick={(e) => e.stopPropagation()}
        onSubmit={(e) => {
          e.preventDefault();
          void save();
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Edit collection"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-black/5 dark:bg-white/10 text-neutral-800 dark:text-neutral-200">
                <Folder className="h-5 w-5" aria-hidden="true" />
              </span>
              <h2 className="text-lg font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100 sm:text-xl">
                Edit collection
              </h2>
            </div>
            <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-300">
              Update the collection title.
            </p>
          </div>
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/5 dark:bg-white/10 text-neutral-700 dark:text-neutral-300 transition hover:bg-black/10 dark:hover:bg-white/20"
            onClick={close}
            aria-label="Close"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-5 flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <div className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">Title</div>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Projects"
              className={nestedInputClassName}
              disabled={isSaving}
              autoFocus
            />
          </div>

          {localError ? (
            <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700 ring-1 ring-red-100">
              {localError}
            </div>
          ) : null}

          <div className="flex items-center justify-end gap-2 pt-1">
            <Button type="button" variant="ghost" onClick={close} disabled={isSaving}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? <ButtonLoader label="Saving…" onDark /> : "Save"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
