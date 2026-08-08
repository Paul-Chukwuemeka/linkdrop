import { useCard } from "@/context/CardContext";
import { useProfile } from "@/context/ProfileContext";
import type { Card } from "@/lib/types";
import { apiFetch } from "@/lib/api";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { ButtonLoader } from "@/components/ui/ButtonLoader";
import { Trash2, Star } from "lucide-react";
import React, { useState } from "react";
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
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);

  async function selectCard() {
    setIsSelecting(true);
    try {
      await apiFetch("/api/profile/last-selected", {
        method: "PATCH",
        json: { card_id: card.id },
      });
      setProfile((prev) => prev ? { ...prev, last_selected_card: card.id } : prev);
    } catch {
      // Selection still works locally even if persistence fails
    } finally {
      setIsSelecting(false);
    }
    loadCard(card.id);
    router.push("/dashboard");
  }

  async function handleConfirmDelete() {
    setIsDeleting(true);
    try {
      await deleteCard(card.id);
      setIsConfirmOpen(false);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div
      className={`flex items-center justify-between gap-3 rounded-xl border bg-white p-3 sm:p-4 transition-colors dark:bg-neutral-900 ${
        isActive
          ? "border-l-4 border-l-brand-green border-gray-200 dark:border-neutral-800"
          : "border-gray-200 dark:border-neutral-800"
      }`}
    >
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-bold text-neutral-900 dark:text-neutral-100">
          {card.name}
        </div>
      </div>
      {!isActive && (
        <button
          className="shrink-0 inline-flex h-10 items-center justify-center rounded-lg bg-brand-green/10 px-3 sm:px-4 text-sm font-semibold text-brand-green transition-colors hover:bg-brand-green/20 touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={selectCard}
          disabled={isSelecting}
        >
          {isSelecting ? <ButtonLoader label="Selecting…" /> : "Select"}
        </button>
      )}
      {isActive && (
        <span className="shrink-0 inline-flex items-center gap-1.5 rounded-lg bg-brand-green/10 px-3 sm:px-4 py-2 text-sm font-medium text-brand-green">
          <Star className="h-3.5 w-3.5" />
          Active
        </span>
      )}
      <button
        onClick={() => {
          setIsConfirmOpen(true);
        }}
        className="shrink-0 inline-flex h-10 items-center gap-1.5 rounded-lg px-3 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 touch-manipulation"
      >
        <Trash2 className="h-4 w-4" />
        Delete
      </button>

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete card"
        message="Are you sure you want to permanently delete this card and all of its links?"
        isPending={isDeleting}
      />
    </div>
  );
}