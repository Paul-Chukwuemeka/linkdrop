"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
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
      <div className="bg-white dark:bg-neutral-900 p-4 sm:p-5 rounded-md shadow-(--shadow-card) ring-1 ring-(--border-color)">
        <div className="text-sm font-bold text-neutral-900 dark:text-neutral-100">Create a card</div>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Main"
            aria-label="Card name"
          />
          <Button
            type="button"
            onClick={() => onCreateCard(name)}
            disabled={isCreating}
            className="shrink-0"
          >
            Create
          </Button>
        </div>
        <div className="mt-2 text-xs text-neutral-600 dark:text-neutral-400">
          Leave blank to create an Untitled card.
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {cards.length === 0 ? (
          <div className="rounded-sm sm:rounded-md bg-white dark:bg-neutral-900 p-4 sm:p-6 text-sm text-neutral-700 dark:text-neutral-300 shadow-(--shadow-card) ring-1 ring-(--border-color)">
            No cards yet.
          </div>
        ) : (
          cards.map((card) => <CardRow deleteCard={deleteCard} key={card.id} card={card} isActive={card.id === activeCardId} />)
        )}
      </div>
    </div>
  );
}
