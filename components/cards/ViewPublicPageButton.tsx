"use client";

import { useCard } from "@/context/CardContext";
import { useProfile } from "@/context/ProfileContext";
import { ExternalLink } from "lucide-react";

export function ViewPublicPageButton({ className = "" }: { className?: string }) {
  const { currentCard } = useCard();
  const { profile } = useProfile();

  if (!currentCard?.is_public || !currentCard.slug || !profile?.username) {
    return null;
  }

  const href = `/u/${encodeURIComponent(profile.username)}/${encodeURIComponent(currentCard.slug)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex h-10 items-center gap-2 rounded-lg border border-[#E5E5E5] bg-white px-4 text-sm font-medium text-[#1B3A1B] transition-colors hover:bg-[#1B3A1B]/5 dark:border-neutral-700 dark:bg-neutral-900 dark:text-[#7ece7e] dark:hover:bg-neutral-800 ${className}`}
    >
      <ExternalLink className="h-4 w-4" />
      View public page
    </a>
  );
}