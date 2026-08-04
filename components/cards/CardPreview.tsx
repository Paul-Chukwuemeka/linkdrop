"use client";

import { useMemo, useState, useEffect } from "react";
import { useProfile } from "@/context/ProfileContext";
import { useCard } from "@/context/CardContext";
import { useStyle } from "@/context/StyleContext";
import { CardContent } from "@/components/cards/CardContent";
import { fonts } from "@/lib/fonts";
import { DEFAULT_CARD_STYLE } from "@/lib/constants";
import { buildCardBackground } from "@/lib/style-utils";
import { apiFetch } from "@/lib/api";
import { Smartphone, Monitor, X, Loader2 } from "lucide-react";
import type { Card, CardTheme } from "@/lib/types";
import toast from "react-hot-toast";

const CardPreview = ({
  mobile,
  card,
}: {
  mobile?: boolean;
  card?: Card;
}) => {
  const { profile } = useProfile();
  const { currentCard, isPreview, setIsPreview } = useCard();
  const { cardStyle } = useStyle();

  const [cards, setCards] = useState<Card[] | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [previewed, setPreviewed] = useState<Card | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [showFrame, setShowFrame] = useState(true);

  const activeCard = card ?? previewed;

  const resolvedStyle: CardTheme | null = activeCard
    ? ({ ...DEFAULT_CARD_STYLE, ...activeCard.style } as CardTheme)
    : cardStyle
      ? ({ ...DEFAULT_CARD_STYLE, ...cardStyle } as CardTheme)
      : null;

  const items = activeCard?.items_list ?? currentCard?.items_list ?? [];
  const bio = activeCard
    ? activeCard.bio ?? null
    : currentCard?.bio ?? profile?.bio ?? null;

  const currentFont = useMemo(
    () =>
      fonts.find(
        (f) =>
          f.name.toLowerCase() === resolvedStyle?.font_style?.toLowerCase(),
      ) ?? fonts[0],
    [resolvedStyle?.font_style],
  );

  useEffect(() => {
    if (mobile) return;
    let ignore = false;
    apiFetch<Card[]>("/api/cards/me")
      .then((data) => {
        if (!ignore) setCards(data);
      })
      .catch(() => {});
    return () => {
      ignore = true;
    };
  }, [mobile]);

  async function handleSelect(id: string) {
    if (!id) {
      setSelectedId(null);
      setPreviewed(null);
      return;
    }
    setSelectedId(id);
    setLoadingPreview(true);
    try {
      const data = await apiFetch<Card>(`/api/cards/${id}/list`);
      setPreviewed(data);
    } catch {
      toast.error("Could not load card preview");
      setSelectedId(null);
      setPreviewed(null);
    } finally {
      setLoadingPreview(false);
    }
  }

  if (!resolvedStyle) return null;

  const headerProps = {
    fullname: profile?.fullname || "",
    username: profile?.username || "",
    bio,
    avatarUrl: profile?.avatar_url || null,
  };
  const cardBody = (
    <CardContent
      {...headerProps}
      items={items}
      cardStyle={resolvedStyle}
      interactive={false}
    />
  );

  if (mobile) {
    return (
      <div
        className="flex items-center flex-col justify-center relative w-full h-auto max-h-[85vh]"
        onClick={() => setIsPreview(false)}
      >
        {isPreview && (
          <button
            className="absolute z-10 top-2 right-2 bg-white/90 backdrop-blur px-4 py-2 text-sm font-semibold rounded-full shadow-lg transition-colors hover:bg-white"
            onClick={(e) => {
              e.stopPropagation();
              setIsPreview(false);
            }}
            aria-label="Close preview"
          >
            Close
          </button>
        )}
        <div
          className={`w-full max-w-94 h-full min-h-200 overflow-hidden rounded-xl ring-1 ring-black/10 ${
            currentFont?.font?.className || ""
          }`}
          style={buildCardBackground(resolvedStyle)}
        >
          <div
            className={`h-full overflow-y-auto scrollbar-hidden px-4 py-8 ${
              currentFont?.font?.className || ""
            }`}
          >
            {cardBody}
          </div>
        </div>
      </div>
    );
  }

  const others = (cards ?? []).filter((c) => c.id !== currentCard?.id);

  return (
    <div className="flex flex-col items-center gap-3 w-full h-full">
      <div className="flex items-center gap-2 w-full">
        <select
          value={selectedId ?? ""}
          onChange={(e) => void handleSelect(e.target.value)}
          aria-label="Preview card"
          className="flex-1 min-w-0 h-9 rounded-lg bg-white dark:bg-neutral-800 px-2 text-sm font-semibold ring-1 ring-black/10 dark:ring-white/10 outline-none"
        >
          <option value="">Current card</option>
          {others.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <button
          onClick={() => setShowFrame((f) => !f)}
          aria-pressed={showFrame}
          aria-label={showFrame ? "Hide device frame" : "Show device frame"}
          title={showFrame ? "Hide device frame" : "Show device frame"}
          className="flex items-center justify-center w-9 h-9 shrink-0 rounded-lg bg-white dark:bg-neutral-800 ring-1 ring-black/10 dark:ring-white/10 text-neutral-700 dark:text-neutral-200"
        >
          {showFrame ? (
            <Smartphone className="w-4" />
          ) : (
            <Monitor className="w-4" />
          )}
        </button>
      </div>

      {activeCard && (
        <div className="flex items-center gap-2 w-full max-w-[336px] rounded-full bg-neutral-100 dark:bg-neutral-800 px-3 py-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-200 ring-1 ring-black/5 dark:ring-white/10">
          {loadingPreview ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Loading preview…
            </>
          ) : (
            <>
              <span className="flex-1 truncate">Previewing {activeCard.name}</span>
              <button
                onClick={() => {
                  setSelectedId(null);
                  setPreviewed(null);
                }}
                aria-label="Back to editing current card"
                className="flex items-center gap-1 rounded-full bg-white dark:bg-neutral-900 px-2 py-1 hover:opacity-80"
              >
                <X className="w-3 h-3" /> Back
              </button>
            </>
          )}
        </div>
      )}

      {showFrame ? (
        <div className="relative shrink-0 rounded-[3rem] bg-neutral-900 dark:bg-neutral-800 p-3 ring-1 ring-black/20 shadow-2xl">
          <div className="absolute left-[-4px] top-24 h-12 w-[4px] rounded-full bg-neutral-700/80 dark:bg-neutral-500/70" />
          <div className="absolute left-[-4px] top-40 h-8 w-[4px] rounded-full bg-neutral-700/80 dark:bg-neutral-500/70" />
          <div className="absolute right-[-4px] top-28 h-10 w-[4px] rounded-full bg-neutral-700/80 dark:bg-neutral-500/70" />
          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-24 h-5 rounded-full bg-black z-10" />
          <div
            className={`overflow-hidden rounded-[2rem] ring-1 ring-black/10 ${
              currentFont?.font?.className || ""
            }`}
            style={buildCardBackground(resolvedStyle)}
          >
            <div
              className={`w-[320px] h-[720px] overflow-y-auto scrollbar-hidden px-4 py-8 ${
                currentFont?.font?.className || ""
              }`}
            >
              {cardBody}
            </div>
          </div>
          <div className="mx-auto mt-2 w-24 h-1 rounded-full bg-white/60" />
        </div>
      ) : (
        <div
          className={`w-[320px] shrink-0 rounded-xl ring-1 ring-black/10 overflow-hidden ${
            currentFont?.font?.className || ""
          }`}
          style={buildCardBackground(resolvedStyle)}
        >
          <div
            className={`h-[720px] overflow-y-auto scrollbar-hidden px-4 py-8 ${
              currentFont?.font?.className || ""
            }`}
          >
            {cardBody}
          </div>
        </div>
      )}
    </div>
  );
};

export default CardPreview;