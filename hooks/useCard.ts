"use client";

import { apiFetch, ApiError } from "@/lib/api";
import type { Card } from "@/lib/types";
import { useCallback, useEffect, useState } from "react";

export function useCard(cardId: string) {
  const [card, setCard] = useState<Card | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setError(null);
    try {
      const res = await apiFetch<Card>(`/cards/${cardId}`);
      setCard(res);
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
      else setError("Failed to load card.");
    } finally {
      setIsLoading(false);
    }
  }, [cardId]);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { card, isLoading, error, reload };
}