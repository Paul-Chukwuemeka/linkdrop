import { UserProfileMe, Card, LinkCreate, CardTheme } from "@/lib/types";
import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { isValidUrl } from "@/utils/validate";
import { apiFetch, ApiError } from "@/lib/api";

type AppContextType = {
  profile: UserProfileMe | null;
  setProfile: Dispatch<SetStateAction<UserProfileMe | null>>;
  isLoading: boolean;
  error: string | null;
  setError: Dispatch<SetStateAction<string | null>>;
  setCurrentCard: Dispatch<SetStateAction<Card | null>>;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  currentCard: Card | null;
  loadCard: (id: string) => void;
  isCreatingLink: boolean;
  setIsCreatingLink: Dispatch<SetStateAction<boolean>>;
  isCreatingCollection: boolean;
  setIsCreatingCollection: Dispatch<SetStateAction<boolean>>;
  isPreview: boolean;
  setIsPreview: Dispatch<SetStateAction<boolean>>;
  selectedCollection: string | null;
  setSelectedCollection: Dispatch<SetStateAction<string | null>>;
  saveLink: (details: LinkCreate) => void;
  addCollection: (title: string) => void;
  updateStyle: () => void;
  cardStyle: CardTheme | null;
  setCardStyle: Dispatch<SetStateAction<CardTheme | null>>;
  isSaving: boolean;
  updateCardStyle: (updates: Partial<CardTheme>) => void;
};


export const AppContext = createContext<AppContextType | null>(null);

export const AppContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [profile, setProfile] = useState<UserProfileMe | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentCard, setCurrentCard] = useState<Card | null>(null);
  const [isCreatingLink, setIsCreatingLink] = useState(false);
  const [isCreatingCollection, setIsCreatingCollection] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<string | null>(
    null,
  );
  const [cardStyle, setCardStyle] = useState<CardTheme | null>(null);
  const [isPreview, setIsPreview] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isChanged, setIsChanged] = useState<boolean>(false);
  const originalStyle = useRef(cardStyle);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setError(null);
      setIsLoading(true);
      try {
        const data = await apiFetch<UserProfileMe>("/profile/me");
        await loadCard(data.current_card);
        if (mounted) setProfile(data);
      } catch (err) {
        if (err instanceof ApiError) setError(err.message);
        else setError("Failed to load profile.");
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [setProfile]);

  async function loadCard(id: string) {
    try {
      const data = await apiFetch<Card | null>(`/cards/${id}`);
      if (!data) return;
      const style = JSON.parse(data.style);
      setCurrentCard(data);
      setCardStyle(style);
      originalStyle.current = style;
    } catch (error) {
      setError("Failed to load card");
      console.log(error);
    }
  }

  function updateCardStyle(updates: Partial<CardTheme>) {
    const updated = { ...cardStyle, ...updates };
    setCardStyle(updated as CardTheme);
    setIsChanged(
      JSON.stringify(updated) !== JSON.stringify(originalStyle.current),
    );
  }

  async function saveLink(details: { url: string; title: string }) {
    const { url, title } = details;
    if (!isValidUrl(url)) {
      setError("Please enter a valid URL");
      return;
    }
    setIsLoading(true);
    try {
      await apiFetch("/links", {
        method: "POST",
        json: {
          title: title.trim() || null,
          url: url.trim() || null,
          card_id: currentCard?.id,
          collection_id: selectedCollection ?? null,
        },
      });
      loadCard(currentCard!.id);
      setIsCreatingLink(false);
      setError(null);
    } catch (error) {
      setError("Failed to create Link");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function addCollection(title: string) {
    setIsLoading(true);
    try {
      await apiFetch("/collections", {
        method: "POST",
        json: { title: title.trim() || null, card_id: currentCard?.id },
      });
      loadCard(currentCard!.id);
      setIsCreatingCollection(false);
    } catch (error) {
      setError("Failed to create Link");
      console.log(error);
    } finally {
      setIsLoading(false);
      setSelectedCollection(null);
    }
  }

  async function updateStyle() {
    setIsSaving(true);
    try {
      const styleString = JSON.stringify(cardStyle);
      const res = await apiFetch(`/cards/${currentCard?.id}/style`, {
        method: "PATCH",
        json: { style: styleString },
      });
      console.log(res);
    } catch (error) {
      setError("Failed to save style");
      console.log(error);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <AppContext.Provider
      value={{
        profile,
        setProfile,
        isLoading,
        error,
        setError,
        currentCard,
        setCurrentCard,
        loadCard,
        setIsLoading,
        isCreatingLink,
        setIsCreatingLink,
        isCreatingCollection,
        setIsCreatingCollection,
        saveLink,
        selectedCollection,
        setSelectedCollection,
        addCollection,
        isPreview,
        setIsPreview,
        cardStyle,
        setCardStyle,
        updateStyle,
        updateCardStyle,
        isSaving,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
