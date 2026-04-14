"use client";

import CardPreview from "@/components/cards/CardPreview";

import { Spinner } from "@/components/ui/Spinner";
import { Dispatch, SetStateAction, useState } from "react";
import { useContext } from "react";
import { AppContext } from "@/context/AppContext";
import Link from "next/link";
import Profile from "@/components/appearance/profile";
import Text from "@/components/appearance/Text";
import Buttons from "@/components/appearance/buttons";
import Background from "@/components/appearance/background";
import Presets from "@/components/appearance/preset";

const route = window.location.href.split("#")[1];

export default function AppearancePage() {
  const { profile, isLoading, error, currentCard } = useContext(AppContext)!;
  const [current, setCurrent] = useState<string>(route ?? "profile");

  if (isLoading) {
    return (
      <div className="rounded-3xl bg-white p-10 shadow-(--shadow-card) ring-1 ring-(--color-border)">
        <div className="flex items-center gap-3">
          <Spinner />
          <div className="text-sm font-semibold text-neutral-800">
            Loading appearance…
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="rounded-3xl bg-white p-6 text-sm text-neutral-800 shadow-(--shadow-card) ring-1 ring-(--color-border)">
        {error || "Profile unavailable."}
      </div>
    );
  }

  return (
    <div className="flex flex-1 h-full min-w-0 flex-col gap-2 sm:gap-3">
      <div className="bg-white p-4 sm:p-5 md:p-6 rounded-xl">
        <h1 className="text-lg sm:text-xl lg:text-2xl font-extrabold tracking-tight text-neutral-900">
          Appearance - ({currentCard?.name})
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-neutral-700">
          Update your public profile details and choose a theme preset.
        </p>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 p-4 text-sm text-red-700 ring-1 ring-red-100">
          {error}
        </div>
      )}

      <div className="flex-1 gap-1 md:gap-4 items-center w-full overflow-auto flex justify-center rounded-xl">
        <div className="overflow-auto rounded-xl bg-white flex justify-center flex-1 w-full p-3 sm:p-4 md:p-6 h-full">
          <div className="w-full max-w-200 text-xs sm:text-sm md:text-base flex flex-col gap-3 md:gap-4">
            <Links setCurrent={setCurrent} current={current} />
            {current === "profile" && <Profile />}
            {current === "text" && <Text />}
            {current === "buttons" && <Buttons />}
            {current === "background" && <Background />}
            {current === "presets" && <Presets />}
          </div>
        </div>
        <div className="md:p-2 hidden lg:flex bg-white p-2 items-center justify-center rounded-xl h-full">
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
    <div className="w-full border-b border-black/20 max-w-150 p-1 flex flex-wrap justify-center sm:justify-start gap-2 sm:gap-1 md:gap-1">
      {sections.map((sect, i) => {
        return (
          <Link
            href={`#${sect}`}
            key={i}
            className={`text-xs sm:text-sm md:text-base px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg transition-all duration-300 text-center capitalize ${
              current != sect
                ? "text-black/50 font-semibold hover:text-black/70 hover:bg-black/5"
                : "font-extrabold bg-black/10"
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
