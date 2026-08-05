"use client";

import CardPreview from "@/components/cards/CardPreview";

import { Spinner } from "@/components/ui/Spinner";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useProfile } from "@/context/ProfileContext";
import { useCard } from "@/context/CardContext";
import Link from "next/link";
import Profile from "@/components/appearance/profile";
import { CardBioAndPublish } from "@/components/appearance/CardBioAndPublish";
import Text from "@/components/appearance/Text";
import Buttons from "@/components/appearance/buttons";
import Background from "@/components/appearance/background";
import Presets from "@/components/appearance/preset";

export default function AppearancePage() {
  const { profile, isLoadingProfile, profileError } = useProfile();
  const { currentCard, isLoadingCard, cardError } = useCard();
  const isLoading = isLoadingProfile || isLoadingCard;
  const error = profileError || cardError;
  const [current, setCurrent] = useState<string>("profile");

  useEffect(() => {
    const onHashChange = () => {
      const route = window.location.hash.slice(1);
      if (route) setCurrent(route);
    };
    const t = window.setTimeout(onHashChange, 0);
    window.addEventListener("hashchange", onHashChange);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("hashchange", onHashChange);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="rounded-3xl bg-white dark:bg-neutral-900 p-10 shadow-(--shadow-card)   ">
        <div className="flex items-center gap-3">
          <Spinner />
          <div className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
            Loading appearance…
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="rounded-3xl bg-white dark:bg-neutral-900 p-6 text-sm text-neutral-800 shadow-(--shadow-card)   ">
        {error || "Profile unavailable."}
      </div>
    );
  }

  if (!currentCard) {
    return (
      <div className="rounded-3xl bg-white dark:bg-neutral-900 p-6 text-sm text-neutral-800 dark:text-neutral-200 shadow-(--shadow-card)   ">
        <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">No cards yet</h3>
        <p className="mt-2 text-neutral-600 dark:text-neutral-400">
          Create a card first to customize its appearance.
        </p>
        <Link
          href="/dashboard/cards"
          className="mt-6 inline-block rounded-full bg-black dark:bg-white dark:text-black px-6 py-2 text-sm font-bold text-white hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
        >
          Create your first card
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-1 h-full min-w-0 flex-col gap-2 sm:gap-3">
      <div className="bg-white dark:bg-neutral-900 p-4 sm:p-5 md:p-6 rounded-xl">
        <h1 className="text-lg sm:text-xl lg:text-2xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100">
          Appearance - ({currentCard?.name})
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-neutral-700 dark:text-neutral-300">
          Update your public profile details and choose a theme preset.
        </p>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 p-4 text-sm text-red-700  ring-red-100">
          {error}
        </div>
      )}

      <div className="flex-1 gap-1 md:gap-4 items-center w-full overflow-auto flex justify-center rounded-xl">
        <div className="overflow-auto rounded-xl bg-white dark:bg-neutral-900 flex justify-center flex-1 w-full p-3 sm:p-4 md:p-6 h-full">
          <div className="w-full max-w-200 text-xs sm:text-sm md:text-base flex flex-col gap-3 md:gap-4">
            <Links setCurrent={setCurrent} current={current} />
            {current === "profile" && (
              <>
                <Profile />
                <CardBioAndPublish />
              </>
            )}
            {current === "text" && <Text />}
            {current === "buttons" && <Buttons />}
            {current === "background" && <Background />}
            {current === "presets" && <Presets />}
          </div>
        </div>
        <div className="md:p-2 hidden lg:flex bg-white dark:bg-neutral-900 p-2 items-center justify-center rounded-xl h-full">
          <CardPreview />
        </div>
      </div>
    </div>
  );
}

function Links({
  current,
  setCurrent,
}: {
  current: string;
  setCurrent: Dispatch<SetStateAction<string>>;
}) {
  const sections = ["profile", "text", "buttons", "background", "presets"];
  return (
    <div className="w-full border-b border-black/20 dark:border-white/20 max-w-150 p-1 flex flex-wrap justify-center sm:justify-start gap-2 sm:gap-1 md:gap-1">
      {sections.map((sect, i) => {
        return (
          <Link
            href={`#${sect}`}
            key={i}
            className={`text-xs sm:text-sm md:text-base px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg transition-all duration-300 text-center capitalize ${
              current != sect
                ? "text-black/50 dark:text-white/50 font-semibold hover:text-black/70 dark:hover:text-white/70 hover:bg-black/5 dark:hover:bg-white/5"
                : "font-extrabold bg-black/10 dark:bg-white/10"
            }`}
            onClick={() => setCurrent(sect)}
          >
            {sect}
          </Link>
        );
      })}
    </div>
  );
}
