import { useCard } from "@/context/CardContext";
import { useProfile } from "@/context/ProfileContext";
import type { Card } from "@/lib/types";
import { apiFetch } from "@/lib/api";
import React from "react";
import { useRouter } from "next/navigation";

export function CardRow({
  card,
  deleteCard,
  isActive,
}: {
  card: Card;
  deleteCard: (id: string) => Promise<void>;
  isActive: boolean;
}) {
  const { loadCard } = useCard();
  const { setProfile } = useProfile();
  const router = useRouter();

  async function selectCard() {
    try {
      await apiFetch("/api/profile/last-selected", {
        method: "PATCH",
        json: { card_id: card.id },
      });
      setProfile((prev) => prev ? { ...prev, last_selected_card: card.id } : prev);
    } catch {
      // Selection still works locally even if persistence fails
    }
    loadCard(card.id);
    router.push("/dashboard");
  }
  return (
    <div className="flex items-center justify-between gap-3 bg-white dark:bg-neutral-900 p-3 sm:p-4 rounded-xl shadow-(--shadow-card) ring-1 ring-(--border-color)">
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-bold text-neutral-900 dark:text-neutral-100">
          {card.name}
        </div>
        <div className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">Card ID: {card.id}</div>
      </div>
      {!isActive && (
        <button
          className="shrink-0 rounded-full bg-(--accent) dark:bg-white dark:text-black px-3 sm:px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity touch-manipulation"
          onClick={selectCard}
        >
          Select
        </button>
      )}
      {isActive && (
        <span className="shrink-0 rounded-full bg-neutral-100 dark:bg-neutral-800 px-3 sm:px-4 py-2 text-sm font-semibold text-neutral-500 dark:text-neutral-400">
          Selected
        </span>
      )}
      <button
        onClick={() => {
          deleteCard(card.id);
        }}
        className="shrink-0 rounded-full bg-red-500/80 px-3 sm:px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity touch-manipulation"
      >
        Delete
      </button>
    </div>
  );
}
