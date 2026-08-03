"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { CardTheme } from "@/lib/types";
import { apiFetch } from "@/lib/api";
import { useCard } from "./CardContext";
import toast from "react-hot-toast";

type StyleContextType = {
  cardStyle: CardTheme | null;
  setCardStyle: React.Dispatch<React.SetStateAction<CardTheme | null>>;
  updateCardStyle: (updates: Partial<CardTheme>) => void;
  updateStyle: () => Promise<void>;
  isSavingStyle: boolean;
};

export const StyleContext = createContext<StyleContextType | null>(null);

export const useStyle = () => {
  const context = useContext(StyleContext);
  if (!context) {
    throw new Error("useStyle must be used within a StyleProvider");
  }
  return context;
};

export function StyleProvider({ children }: { children: React.ReactNode }) {
  const { currentCard, setCardError } = useCard();
  const [cardStyle, setCardStyle] = useState<CardTheme | null>(null);
  const [isSavingStyle, setIsSavingStyle] = useState(false);

  useEffect(() => {
    setCardStyle(currentCard?.style ?? null);
  }, [currentCard?.id, currentCard?.style]);

  function updateCardStyle(updates: Partial<CardTheme>) {
    if (!cardStyle) return;
    setCardStyle({ ...cardStyle, ...updates } as CardTheme);
  }

  async function updateStyle() {
    setIsSavingStyle(true);
    try {
      await apiFetch(`/api/cards/${currentCard?.id}/style`, {
        method: "PATCH",
        json: { style: cardStyle },
      });
      toast.success("Card style saved!");
    } catch {
      setCardError("Failed to save style");
      toast.error("Failed to save style");
    } finally {
      setIsSavingStyle(false);
    }
  }

  return (
    <StyleContext.Provider
      value={{ cardStyle, setCardStyle, updateCardStyle, updateStyle, isSavingStyle }}
    >
      {children}
    </StyleContext.Provider>
  );
}
