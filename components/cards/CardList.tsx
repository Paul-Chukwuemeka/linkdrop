"use client";

import { Input } from "@/components/ui/Input";
import { ButtonLoader } from "@/components/ui/ButtonLoader";
import { IdCard } from "lucide-react";
import type { Card } from "@/lib/types";
import React, { useState } from "react";
import { CardRow } from "./CardRow";

export function CardList({
  cards,
  onCreateCard,
  isCreating,
  deleteCard,
  activeCardId,
}: {
  cards: Card[];
  onCreateCard: (name: string) => Promise<void>;
  isCreating: boolean;
  deleteCard: (id: string) => Promise<void>;
  activeCardId: string | null;
}) {
  const [name, setName] = useState("");

  return (
    <div className="flex flex-col w-full max-w-200 gap-3 sm:gap-4">
      <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl p-4 sm:p-5">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-neutral-100">
          Create a card
        </h3>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Main"
            aria-label="Card name"
            className="flex-1 min-w-0"
          />
          <button
            type="button"
            onClick={() => onCreateCard(name)}
            disabled={isCreating}
            className="shrink-0 inline-flex h-10 items-center justify-center justify-self-start rounded-lg bg-brand-green px-5 text-sm font-medium text-white transition-colors hover:bg-brand-green-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isCreating ? <ButtonLoader label="Creating…" onDark /> : "Create"}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between px-1">
        <span className="text-sm font-semibold text-gray-900 dark:text-neutral-100">
          Your cards
        </span>
        <span className="text-xs text-gray-500 dark:text-neutral-400">
          {cards.length} {cards.length === 1 ? "card" : "cards"}
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {cards.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl bg-white dark:bg-neutral-900 p-8 border border-gray-200 dark:border-neutral-800 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-green/10">
              <IdCard className="h-6 w-6 text-brand-green" />
            </div>
            <p className="mt-3 text-sm font-medium text-gray-900 dark:text-neutral-100">
              No cards yet
            </p>
            <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
              Create your first card above to start publishing links.
            </p>
          </div>
        ) : (
          cards.map((card) => <CardRow deleteCard={deleteCard} key={card.id} card={card} isActive={card.id === activeCardId} />)
        )}
      </div>
    </div>
  );
}