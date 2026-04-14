"use client";

import { CardList } from "@/components/cards/CardList";
import { Spinner } from "@/components/ui/Spinner";
import { apiFetch, ApiError } from "@/lib/api";
import type { Card } from "@/lib/types";
import React, { useCallback, useEffect, useState } from "react";

export function CardsOverview() {
  const [cards, setCards] = useState<Card[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      const data = await apiFetch<Card[]>("/cards/me");
      setCards(data);
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
      else setError("Failed to load cards.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function createCard(name: string) {
    setError(null);
    setIsCreating(true);
    try {
      await apiFetch<Card>("/cards", {
        method: "POST",
        json: { name: name.trim() || null },
      });
      await load();
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
      else setError("Failed to create card.");
    } finally {
      setIsCreating(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center bg-white p-10 shadow-(--shadow-card) ring-1 ring-(--color-border)">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 max-w-200 sm:gap-4 p-3 sm:p-4">
      {error && (
        <div className="bg-red-50 p-3 sm:p-4 rounded-xl text-sm text-red-700 ring-1 ring-red-100">
          {error}
        </div>
      )}
      <CardList cards={cards} onCreateCard={createCard} isCreating={isCreating} />
    </div>
  );
}

