"use client";

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
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
  previewImage: string | null;
  setPreviewImage: (url: string | null) => void;
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
  const { currentCard } = useCard();
  const [cardStyle, setCardStyle] = useState<CardTheme | null>(null);
  const [isSavingStyle, setIsSavingStyle] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Authoritative copy of the style that is always current, even within a
  // single tick. updateStyle reads this so a value (e.g. an uploaded
  // background image URL) set just before saving is included in the request.
  const cardStyleRef = useRef<CardTheme | null>(null);

  useEffect(() => {
    cardStyleRef.current = currentCard?.style ?? null;
    setCardStyle(currentCard?.style ?? null);
    setPreviewImage(null);
  }, [currentCard?.id, currentCard?.style]);

  const updateCardStyle = useCallback((updates: Partial<CardTheme>) => {
    if (!cardStyleRef.current) return;
    const next = { ...cardStyleRef.current, ...updates } as CardTheme;
    cardStyleRef.current = next;
    setCardStyle(next);
  }, []);

  const updateStyle = useCallback(async () => {
    setIsSavingStyle(true);
    try {
      await apiFetch(`/api/cards/${currentCard?.id}/style`, {
        method: "PATCH",
        json: { style: cardStyleRef.current },
      });
      toast.success("Card style saved!");
    } catch {
      toast.error("Failed to save style");
    } finally {
      setIsSavingStyle(false);
    }
  }, [currentCard?.id]);

  return (
    <StyleContext.Provider
      value={{ cardStyle, setCardStyle, updateCardStyle, updateStyle, isSavingStyle, previewImage, setPreviewImage }}
    >
      {children}
    </StyleContext.Provider>
  );
}
