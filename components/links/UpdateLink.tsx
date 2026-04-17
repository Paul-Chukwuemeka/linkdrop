"use client";

import { useCard } from "@/context/CardContext";
import { apiFetch, ApiError } from "@/lib/api";
import type { Link as LinkType } from "@/lib/types";
import { isValidUrl } from "@/utils/validate";
import { Link2, X } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Spinner } from "../ui/Spinner";

export function UpdateLink({
  link,
  onClose,
}: {
  link: LinkType;
  onClose: () => void;
}) {
  const { currentCard, loadCard, setCardError: setError } = useCard();
  const [title, setTitle] = useState(link.title);
  const [url, setUrl] = useState(link.url);
  const [isSaving, setIsSaving] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const nestedInputClassName =
    "rounded-xl bg-neutral-50 shadow-none ring-neutral-200 focus:ring-[var(--accent)]";

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
    const nextUrl = url.trim();

    if (!nextTitle || !nextUrl) {
      setLocalError("Title and URL are required.");
      return;
    }

    if (!isValidUrl(nextUrl)) {
      setLocalError("Please enter a valid URL.");
      return;
    }

    setLocalError(null);
    setError(null);
    setIsSaving(true);
    try {
      await apiFetch<LinkType>(`/links/${link.id}`, {
        method: "PATCH",
        json: { title: nextTitle, url: nextUrl },
      });
      if (currentCard?.id) void loadCard(currentCard.id);
      onClose();
    } catch (err) {
      if (err instanceof ApiError) setLocalError(err.message);
      else setLocalError("Failed to update link.");
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
        className="w-full max-w-md rounded-2xl bg-white p-4 shadow-(--shadow-card) ring-1 ring-(--color-border) sm:p-6"
        onClick={(e) => e.stopPropagation()}
        onSubmit={(e) => {
          e.preventDefault();
          void save();
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Edit link"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-black/5 text-neutral-800">
                <Link2 className="h-5 w-5" aria-hidden="true" />
              </span>
              <h2 className="text-lg font-extrabold tracking-tight text-neutral-900 sm:text-xl">
                Edit link
              </h2>
            </div>
            <p className="mt-2 text-sm text-neutral-700">
              Update the title and URL.
            </p>
          </div>
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/5 text-neutral-700 transition hover:bg-black/10"
            onClick={close}
            aria-label="Close"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-5 flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <div className="text-xs font-semibold text-neutral-600">Title</div>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. My portfolio"
              className={nestedInputClassName}
              disabled={isSaving}
              autoFocus
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="text-xs font-semibold text-neutral-600">URL</div>
            <Input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://…"
              className={nestedInputClassName}
              disabled={isSaving}
            />
            <div className="text-xs text-neutral-500">
              Tip: use a full URL (including https://).
            </div>
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
              {isSaving ? <Spinner /> : "Save"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
