"use client";

import { useCard } from "@/context/CardContext";
import { useProfile } from "@/context/ProfileContext";
import { useState } from "react";
import { Copy } from "lucide-react";

export function CardBioAndPublish() {
  const { currentCard, updateCardMeta, cardError } = useCard();
  const { profile } = useProfile();
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!currentCard) return null;

  const published = currentCard.is_public === true;

  const pageUrl =
    published && profile?.username && currentCard.slug
      ? `${window.location.origin}/u/${profile.username}/${currentCard.slug}`
      : null;

  async function runWithSaving<T>(fn: () => Promise<T>) {
    setIsSaving(true);
    try {
      await fn();
    } finally {
      setIsSaving(false);
    }
  }

  async function handleTogglePublish() {
    await runWithSaving(() => updateCardMeta({ is_public: !published }));
  }

  async function handleCopy() {
    if (!pageUrl) return;
    await navigator.clipboard.writeText(pageUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 p-4">
      <div>
        <h3 className="font-bold text-lg text-neutral-800 dark:text-neutral-200">
          Publishing
        </h3>
        <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
          This applies to the “{currentCard.name}” card.
        </p>
      </div>

      {cardError && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300  ring-red-100 dark:ring-red-800/50">
          {cardError}
        </div>
      )}

      <div className="flex items-center justify-between gap-3 rounded-xl bg-white dark:bg-neutral-900 p-4  ring-black/5">
        <div>
          <div className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
            Public page
          </div>
          <div className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
            {published
              ? "This card is live at its public URL."
              : "Publish this card as its own public page."}
          </div>
        </div>
        <button
          onClick={handleTogglePublish}
          disabled={isSaving}
          className={`relative h-6 w-12 shrink-0 rounded-full transition-colors ${
            published ? "bg-black dark:bg-white" : "bg-neutral-300 dark:bg-neutral-600"
          }`}
          aria-checked={published}
          role="switch"
        >
          <span
            className={`absolute left-0 top-0.5 h-5 w-5 rounded-full bg-white dark:bg-black transition-transform ${
              published ? "translate-x-6.5" : "translate-x-0.5"
            }`}
          />
        </button>
      </div>

      {pageUrl && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 rounded-lg bg-black/5 dark:bg-white/5 px-3 py-2 text-xs font-mono text-neutral-700 dark:text-neutral-300">
            <span className="min-w-0 flex-1 truncate">{pageUrl}</span>
            <button
              onClick={handleCopy}
              className="shrink-0 p-1 text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
              aria-label="Copy link"
            >
              {copied ? <span className="text-xs font-sans font-semibold">Copied</span> : <Copy className="h-3.5 w-3.5" />}
            </button>
          </div>
          <a
            href={pageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 underline-offset-2 hover:underline"
          >
            Open public page →
          </a>
        </div>
      )}
    </div>
  );
}
