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
  const { profile, isLoading, error, currentCard } =
    useContext(AppContext)!;
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
    <div className="flex flex-1 h-full min-w-0 flex-col gap-3">
      <div className="bg-white p-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-neutral-900">
          Appearance - ({currentCard?.name})
        </h1>
        <p className="mt-2 text-sm text-neutral-700">
          Update your public profile details and choose a theme preset.
        </p>
      </div>

      {error && (
        <div className="rounded-3xl bg-red-50 p-4 text-sm text-red-700 ring-1 ring-red-100">
          {error}
        </div>
      )}

      <div className="flex items-center flex-1 overflow-auto w-full bg-white gap-4">
        <div className="p-6 flex-1 flex items-center flex-col gap-4 h-full ">
          <div className="w-full max-w-200 flex flex-col gap-5">
            <Links setCurrent={setCurrent} current={current} />
            {current === "profile" && <Profile />}
            {current === "text" && <Text />}
            {current === "buttons" && <Buttons />}
            {current === "background" && <Background />}
            {current === "presets" && <Presets />}
          </div>
        </div>
        <div className="max-lg:hidden px-10 p-2">
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
    <div className="w-full border-b border-black/20 max-w-120 p-1 grid-cols-[auto_auto_auto_auto_auto] grid gap-3">
      {sections.map((sect, i) => {
        return (
          <Link
            href={`#${sect}`}
            key={i}
            className={`${current != sect ? "text-black/50 font-semibold" : " font-extrabold"} duration-300 text-center capitalize`}
            onClick={() => setCurrent(sect)}
          >
            {sect}
          </Link>
        );
      })}
    </div>
  );
}
