"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { Card, ItemFromList } from "@/lib/types";
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
  isLoadingReorder: boolean;
  setIsLoadingReorder: React.Dispatch<React.SetStateAction<boolean>>;
  saveLink: (details: { url: string; title: string }) => Promise<void>;
  addCollection: (title: string) => Promise<void>;
  renameCard: (newName: string) => Promise<void>;
  updateCardMeta: (meta: {
    bio?: string | null;
    is_public?: boolean;
  }) => Promise<void>;
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
  const [isLoadingReorder, setIsLoadingReorder] = useState(false);

  // Serializes card loads: only the most recent request may update state, so
  // parallel loads (eager fetch, current_card, last_selected_card) can't race.
  const loadRequestIdRef = useRef(0);

  const loadCard = useCallback(async (id: string) => {
    const requestId = ++loadRequestIdRef.current;
    setIsLoadingCard(true);
    try {
      const data = await apiFetch<Card | null>(`/api/cards/${id}/list`);
      if (requestId === loadRequestIdRef.current && data) setCurrentCard(data);
    } catch {
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
  }, [profile, profile?.last_selected_card, profile?.current_card, currentCard?.id, loadCard]);

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

  async function updateCardMeta(meta: {
    bio?: string | null;
    use_profile_bio?: boolean;
    is_public?: boolean;
  }) {
    if (!currentCard) return;
    const previousCard = currentCard;

    const nextCard: Card = {
      ...currentCard,
      bio:
        meta.bio !== undefined
          ? meta.bio?.trim() || null
          : currentCard.bio,
      use_profile_bio:
        meta.use_profile_bio !== undefined
          ? meta.use_profile_bio
          : currentCard.use_profile_bio,
      is_public:
        meta.is_public !== undefined
          ? meta.is_public
          : currentCard.is_public,
    };

    setCurrentCard(nextCard);
    setCardError(null);

    try {
      const updated = await apiFetch<Card>(`/api/cards/${currentCard.id}`, {
        method: "PATCH",
        json: {
          ...(meta.bio !== undefined ? { bio: meta.bio?.trim() || null } : {}),
          ...(meta.use_profile_bio !== undefined ? { use_profile_bio: meta.use_profile_bio } : {}),
          ...(meta.is_public !== undefined
            ? { is_public: meta.is_public }
            : {}),
        },
      });
      setCurrentCard((prev) => (prev ? { ...prev, ...updated } : prev));
      toast.success(meta.is_public ? "Card published!" : "Card updated!");
    } catch (err) {
      setCurrentCard(previousCard);
      const msg = err instanceof ApiError ? err.message : "Failed to update card.";
      setCardError(msg);
      toast.error(msg);
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
    const previousCard = currentCard;
    setIsLoadingReorder(true);

    const findLink = () => {
      for (const item of currentCard.items_list) {
        if (item.type === "link" && item.content.id === linkId) {
          return item.content;
        }
        if (item.type === "collection") {
          const link = item.content.links.find((l) => l.id === linkId);
          if (link) return link;
        }
      }
      return undefined;
    };

    const link = findLink();
    if (!link) return;

    const scopeMaxPosition = (): number => {
      if (collectionId) {
        const target = currentCard.items_list.find(
          (i): i is Extract<ItemFromList, { type: "collection" }> =>
            i.type === "collection" && i.content.id === collectionId,
        );
        const positions = target?.content.links.map((l) => l.position) ?? [];
        return positions.length ? Math.max(...positions) + 1 : 0;
      }
      const positions: number[] = [];
      for (const item of currentCard.items_list) {
        positions.push(item.type === "link" ? item.content.position : item.position);
      }
      return positions.length ? Math.max(...positions) + 1 : 0;
    };

    const targetPosition = scopeMaxPosition();

    const nextItems: ItemFromList[] = currentCard.items_list.flatMap(
      (item): ItemFromList[] => {
        if (item.type === "link") {
          return item.content.id === linkId ? [] : [item];
        }
        const links = item.content.links.filter((l) => l.id !== linkId);
        return [{ ...item, content: { ...item.content, links } }];
      },
    );

    if (collectionId) {
      const targetIndex = nextItems.findIndex(
        (i): i is Extract<ItemFromList, { type: "collection" }> =>
          i.type === "collection" && i.content.id === collectionId,
      );
      if (targetIndex >= 0) {
        const target = nextItems[targetIndex] as Extract<ItemFromList, { type: "collection" }>;
        nextItems[targetIndex] = {
          ...target,
          content: {
            ...target.content,
            links: [
              ...target.content.links,
              { ...link, collection_id: collectionId, position: targetPosition },
            ],
          },
        };
      }
    } else {
      nextItems.push({
        type: "link",
        position: targetPosition,
        content: { ...link, collection_id: null, position: targetPosition },
      });
    }

    setCurrentCard({ ...currentCard, items_list: nextItems });
    setCardError(null);

    try {
      await apiFetch(`/api/links/${linkId}`, {
        method: "PATCH",
        json: { collection_id: collectionId },
      });
      toast.success("Link moved!");
    } catch (err) {
      setCurrentCard(previousCard);
      const msg = err instanceof ApiError ? err.message : "Failed to move link.";
      setCardError(msg);
      toast.error(msg);
    } finally {
      setIsLoadingReorder(false);
    }
  }

  async function reorderLinks(collectionId: string | null, orderedIds: string[]) {
    if (!currentCard) return;
    const previousCard = currentCard;
    const items = orderedIds.map((id, index) => ({ id, position: index }));
    setIsLoadingReorder(true);

    const nextItems: ItemFromList[] = currentCard.items_list.map((item) => {
      if (collectionId) {
        if (item.type !== "collection" || item.content.id !== collectionId) return item;
        const positionMap = new Map(items.map((x) => [x.id, x.position]));
        const links = item.content.links
          .filter((l) => positionMap.has(l.id))
          .map((l) => ({ ...l, position: positionMap.get(l.id)! }))
          .sort((a, b) => a.position - b.position);
        return { ...item, content: { ...item.content, links } };
      }
      if (item.type !== "link") return item;
      const positionMap = new Map(items.map((x) => [x.id, x.position]));
      if (!positionMap.has(item.content.id)) return item;
      return { ...item, position: positionMap.get(item.content.id)! };
    });

    setCurrentCard({ ...currentCard, items_list: nextItems });
    setCardError(null);

    try {
      await apiFetch(`/api/cards/${currentCard.id}/links/reorder`, {
        method: "PATCH",
        json: { collection_id: collectionId, items },
      });
    } catch (err) {
      setCurrentCard(previousCard);
      const msg = err instanceof ApiError ? err.message : "Failed to save order.";
      setCardError(msg);
      toast.error(msg);
    } finally {
      setIsLoadingReorder(false);
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
        isLoadingReorder,
        setIsLoadingReorder,
        saveLink,
        addCollection,
        renameCard,
        updateCardMeta,
        moveLink,
        reorderLinks,
      }}
    >
      {children}
    </CardContext.Provider>
  );
}
