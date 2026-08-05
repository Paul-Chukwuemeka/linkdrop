"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useCard } from "@/context/CardContext";
import { useProfile } from "@/context/ProfileContext";
import { apiFetch } from "@/lib/api";
import type { Card } from "@/lib/types";
import { ArrowLeftRight, Check, Loader2 } from "lucide-react";

export function CardSwitcher() {
  const { currentCard, loadCard } = useCard();
  const { setProfile } = useProfile();
  const [cards, setCards] = useState<Card[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSwitching, setIsSwitching] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await apiFetch<Card[]>("/api/cards/me");
        setCards(data);
      } catch {
        // silently fail — dropdown just won't populate
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = useCallback(async (cardId: string) => {
    if (cardId === currentCard?.id) {
      setIsOpen(false);
      return;
    }
    setIsSwitching(true);
    setIsOpen(false);
    try {
      await apiFetch("/api/profile/last-selected", {
        method: "PATCH",
        json: { card_id: cardId },
      });
      setProfile((prev) => prev ? { ...prev, last_selected_card: cardId } : prev);
    } catch {
      // proceed even if persistence fails
    }
    loadCard(cardId);
    setIsSwitching(false);
  }, [currentCard?.id, loadCard, setProfile]);

  if (isLoading || cards.length <= 1) return null;

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isSwitching}
        className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors disabled:opacity-50"
        aria-label="Switch card"
      >
        {isSwitching ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <ArrowLeftRight className="h-5 w-5 text-neutral-600 dark:text-neutral-300" />
        )}
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-1 min-w-48 rounded-xl bg-white dark:bg-neutral-800 shadow-lg ring-1 ring-black/5 dark:ring-white/10 py-1">
          {cards.map((card) => (
            <button
              key={card.id}
              onClick={() => handleSelect(card.id)}
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-left hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
            >
              <span className="truncate flex-1 text-neutral-900 dark:text-neutral-100">
                {card.name}
              </span>
              {card.id === currentCard?.id && (
                <Check className="h-4 w-4 shrink-0 text-(--accent)" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
