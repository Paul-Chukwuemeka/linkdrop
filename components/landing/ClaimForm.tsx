"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Variant = "hero" | "final";

const BUTTON_LABEL: Record<Variant, string> = { hero: "go", final: "claim it" };

const BUTTON_CLASS: Record<Variant, string> = {
  hero: "bg-brand-green text-background-primary sticker-shadow-gold",
  final: "bg-accent-gold text-brand-green sticker-shadow",
};

export default function ClaimForm({ variant }: { variant: Variant }) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const inputId = `${variant}-username`;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const name = username.trim();
    router.push(name ? `/register?username=${encodeURIComponent(name)}` : "/register");
  };

  return (
    <form onSubmit={handleSubmit} className="flex max-w-[420px] gap-2">
      <label
        htmlFor={inputId}
        className="flex min-w-0 flex-1 items-center rounded-md border-2 border-brand-green bg-white px-3.5 py-2.5 shadow-[3px_3px_0_rgba(27,58,27,0.15)] focus-within:ring-2 focus-within:ring-brand-green/30 focus-within:ring-offset-2"
      >
        <span className="sr-only">Your LinkDrop username</span>
        <span
          aria-hidden="true"
          className="font-[family-name:var(--font-jetbrains)] text-xs text-[#5a5a48] sm:text-sm"
        >
          linkdrop.co/
        </span>
        <input
          id={inputId}
          type="text"
          placeholder="yourname"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          spellCheck={false}
          autoComplete="off"
          className="w-full min-w-0 bg-transparent text-sm font-semibold text-brand-green placeholder:text-[#5a5a48] focus:outline-none"
        />
      </label>
      <button
        type="submit"
        className={`shrink-0 rounded-md px-5 py-2.5 font-[family-name:var(--font-space-grotesk)] text-sm font-extrabold transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/30 focus-visible:ring-offset-2 ${BUTTON_CLASS[variant]}`}
      >
        {BUTTON_LABEL[variant]}
      </button>
    </form>
  );
}
