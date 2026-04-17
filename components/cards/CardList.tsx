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
}: {
  cards: Card[];
  onCreateCard: (name: string) => Promise<void>;
  isCreating: boolean;
  deleteCard: (id: string) => Promise<void>;
}) {
  const [name, setName] = useState("");

  return (
    <div className="flex flex-col w-full max-w-200 gap-3 sm:gap-4">
      <div className="bg-white p-4 sm:p-5 rounded-xl shadow-(--shadow-card) ring-1 ring-(--color-border)">
        <div className="text-sm font-bold text-neutral-900">Create a card</div>
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
        <div className="mt-2 text-xs text-neutral-600">
          Leave blank to create an Untitled card.
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {cards.length === 0 ? (
          <div className="rounded-xl sm:rounded-2xl bg-white p-4 sm:p-6 text-sm text-neutral-700 shadow-(--shadow-card) ring-1 ring-(--color-border)">
            No cards yet.
          </div>
        ) : (
          cards.map((card) => <CardRow deleteCard={deleteCard} key={card.id} card={card} />)
        )}
      </div>
    </div>
  );
}
