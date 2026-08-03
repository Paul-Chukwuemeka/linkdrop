"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { Card } from "@/lib/types";
import { apiFetch, ApiError } from "@/lib/api";
import { useProfile } from "./ProfileContext";
import toast from "react-hot-toast";
import { isValidUrl } from "@/utils/validate";

type CardContextType = {
  currentCard: Card | null;
  setCurrentCard: React.Dispatch<React.SetStateAction<Card | null>>;
  loadCard: (id: string) => Promise<void>;
  isLoadingCard: boolean;
  setIsLoadingCard: React.Dispatch<React.SetStateAction<boolean>>;
  isSavingLink: boolean;
  isSavingCollection: boolean;
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
  moveLink: (linkId: string, collectionId: string | null) => Promise<void>;
  reorderLinks: (collectionId: string | null, orderedIds: string[]) => Promise<void>;
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
  const [isLoadingCard, setIsLoadingCard] = useState<boolean>(true);
  const [isSavingLink, setIsSavingLink] = useState(false);
  const [isSavingCollection, setIsSavingCollection] = useState(false);
  const [cardError, setCardError] = useState<string | null>(null);
  const [isCreatingLink, setIsCreatingLink] = useState(false);
  const [isCreatingCollection, setIsCreatingCollection] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [isPreview, setIsPreview] = useState<boolean>(false);

  // Serializes card loads: only the most recent request may update state, so
  // parallel loads (eager fetch, current_card, last_selected_card) can't race.
  const loadRequestIdRef = useRef(0);

  const loadCard = useCallback(async (id: string) => {
    const requestId = ++loadRequestIdRef.current;
    setIsLoadingCard(true);
    try {
      const data = await apiFetch<Card | null>(`/api/cards/${id}/list`);
      if (requestId === loadRequestIdRef.current && data) setCurrentCard(data);
    } catch (error) {
      if (requestId === loadRequestIdRef.current) {
        setCardError("Failed to load card");
      }
    } finally {
      if (requestId === loadRequestIdRef.current) setIsLoadingCard(false);
    }
  }, []);

  // Eagerly load the current card in parallel with profile (no profile dependency)
  useEffect(() => {
    let mounted = true;
    const requestId = ++loadRequestIdRef.current;
    (async () => {
      setIsLoadingCard(true);
      try {
        const data = await apiFetch<Card>("/api/cards/current/list");
        if (mounted && requestId === loadRequestIdRef.current && data) {
          setCurrentCard(data);
        }
      } catch {
        // Will fall back to the profile-derived path below
      } finally {
        if (mounted) setIsLoadingCard(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Once the profile arrives, prefer the last card the user selected to edit,
  // falling back to the current (main) card. Only triggers on real changes.
  useEffect(() => {
    if (!profile) return;
    const preferredCardId = profile.last_selected_card ?? profile.current_card;
    if (preferredCardId && preferredCardId !== currentCard?.id) {
      loadCard(preferredCardId);
    }
  }, [profile?.last_selected_card, profile?.current_card, loadCard]);

  async function saveLink(details: { url: string; title: string }) {
    const { url, title } = details;
    if (!isValidUrl(url)) {
      setCardError("Please enter a valid URL");
      return;
    }
    setIsSavingLink(true);
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
      setIsSavingLink(false);
    }
  }

  async function addCollection(title: string) {
    setIsSavingCollection(true);
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
      setIsSavingCollection(false);
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

  async function moveLink(linkId: string, collectionId: string | null) {
    if (!currentCard) return;
    try {
      await apiFetch(`/api/links/${linkId}`, {
        method: "PATCH",
        json: { collection_id: collectionId },
      });
      await loadCard(currentCard.id);
      toast.success("Link moved!");
      setCardError(null);
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Failed to move link.";
      setCardError(msg);
      toast.error(msg);
    }
  }

  async function reorderLinks(collectionId: string | null, orderedIds: string[]) {
    if (!currentCard) return;
    try {
      await apiFetch(`/api/cards/${currentCard.id}/links/reorder`, {
        method: "PATCH",
        json: {
          collection_id: collectionId,
          items: orderedIds.map((id, index) => ({ id, position: index })),
        },
      });
      await loadCard(currentCard.id);
      setCardError(null);
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Failed to save order.";
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
        isSavingLink,
        isSavingCollection,
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
        moveLink,
        reorderLinks,
      }}
    >
      {children}
    </CardContext.Provider>
  );
}
