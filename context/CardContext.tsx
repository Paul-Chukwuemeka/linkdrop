"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Card, LinkCreate } from "@/lib/types";
import { apiFetch, ApiError } from "@/lib/api";
import { useProfile } from "./ProfileContext";
import toast from "react-hot-toast";
import { isValidUrl } from "@/utils/validate";

type CardContextType = {
  currentCard: Card | null;
  setCurrentCard: React.Dispatch<React.SetStateAction<Card | null>>;
  loadCard: (id: string, forceStyleSync?: boolean) => Promise<void>;
  isLoadingCard: boolean;
  setIsLoadingCard: React.Dispatch<React.SetStateAction<boolean>>;
  cardError: string | null;
  setCardError: React.Dispatch<React.SetStateAction<string | null>>;
  isCreatingLink: boolean;
  setIsCreatingLink: React.Dispatch<React.SetStateAction<boolean>>;
  isCreatingCollection: boolean;
  setIsCreatingCollection: React.Dispatch<React.SetStateAction<boolean>>;
  selectedCollection: string | null;
  setSelectedCollection: React.Dispatch<React.SetStateAction<string | null>>;
  isPreview: boolean;
  setIsPreview: React.Dispatch<React.SetStateAction<boolean>>;
  saveLink: (details: { url: string; title: string }) => Promise<void>;
  addCollection: (title: string) => Promise<void>;
  renameCard: (newName: string) => Promise<void>;
};

export const CardContext = createContext<CardContextType | null>(null);

export const useCard = () => {
  const context = useContext(CardContext);
  if (!context) {
    throw new Error("useCard must be used within a CardProvider");
  }
  return context;
};

export function CardProvider({ children }: { children: React.ReactNode }) {
  const { profile } = useProfile();
  
  const [currentCard, setCurrentCard] = useState<Card | null>(null);
  const [isLoadingCard, setIsLoadingCard] = useState<boolean>(false);
  const [cardError, setCardError] = useState<string | null>(null);
  const [isCreatingLink, setIsCreatingLink] = useState(false);
  const [isCreatingCollection, setIsCreatingCollection] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [isPreview, setIsPreview] = useState<boolean>(false);

  const loadCard = useCallback(async (id: string) => {
    try {
      const data = await apiFetch<Card | null>(`/api/cards/${id}/list`);
      if (data) setCurrentCard(data);
    } catch (error) {
      setCardError("Failed to load card");
    }
  }, []);

  // Eagerly load the current card in parallel with profile (no profile dependency)
  useEffect(() => {
    let mounted = true;
    (async () => {
      setIsLoadingCard(true);
      try {
        const data = await apiFetch<Card>("/api/cards/current/list");
        if (mounted && data) setCurrentCard(data);
      } catch {
        // Will fall back to profile.current_card path below
      } finally {
        if (mounted) setIsLoadingCard(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Fallback: react to profile.current_card changes (e.g. user switches active card)
  useEffect(() => {
    if (profile?.current_card && profile.current_card !== currentCard?.id) {
      loadCard(profile.current_card);
    }
  }, [profile?.current_card, loadCard, currentCard?.id]);

  async function saveLink(details: { url: string; title: string }) {
    const { url, title } = details;
    if (!isValidUrl(url)) {
      setCardError("Please enter a valid URL");
      return;
    }
    setIsLoadingCard(true);
    try {
      await apiFetch("/api/links", {
        method: "POST",
        json: {
          title: title.trim() || null,
          url: url.trim() || null,
          card_id: currentCard?.id,
          collection_id: selectedCollection ?? null,
        },
      });
      await loadCard(currentCard!.id);
      setIsCreatingLink(false);
      setCardError(null);
      toast.success("Link added!");
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Failed to create link.";
      setCardError(msg);
      toast.error(msg);
    } finally {
      setIsLoadingCard(false);
    }
  }

  async function addCollection(title: string) {
    setIsLoadingCard(true);
    try {
      await apiFetch("/api/collections", {
        method: "POST",
        json: { title: title.trim() || null, card_id: currentCard?.id },
      });
      await loadCard(currentCard!.id);
      setIsCreatingCollection(false);
      toast.success("Collection created!");
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Failed to create collection.";
      setCardError(msg);
      toast.error(msg);
    } finally {
      setIsLoadingCard(false);
      setSelectedCollection(null);
    }
  }

  async function renameCard(newName: string) {
    if (!currentCard) return;
    if (!newName.trim()) {
      setCardError("Card name cannot be empty");
      return;
    }

    const previousName = currentCard.name;
    setCurrentCard({ ...currentCard, name: newName });

    try {
      await apiFetch(`/api/cards/${currentCard.id}`, {
        method: "PATCH",
        json: { name: newName.trim() },
      });
      setCardError(null);
      toast.success("Card renamed!");
    } catch (err) {
      setCurrentCard({ ...currentCard, name: previousName });
      const msg = err instanceof ApiError ? err.message : "Failed to rename card.";
      setCardError(msg);
      toast.error(msg);
    }
  }

  return (
    <CardContext.Provider
      value={{
        currentCard,
        setCurrentCard,
        loadCard,
        isLoadingCard,
        setIsLoadingCard,
        cardError,
        setCardError,
        isCreatingLink,
        setIsCreatingLink,
        isCreatingCollection,
        setIsCreatingCollection,
        selectedCollection,
        setSelectedCollection,
        isPreview,
        setIsPreview,
        saveLink,
        addCollection,
        renameCard,
      }}
    >
      {children}
    </CardContext.Provider>
  );
}
