"use client";

import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const inputId = "hero-username";

export function HeroForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      router.push(`/register?username=${encodeURIComponent(username.trim())}`);
    } else {
      router.push("/register");
    }
  };

  return (
    <div className="mt-8">
      <form
        onSubmit={handleSubmit}
        className="flex flex-wrap items-center justify-center"
      >
        <label htmlFor={inputId} className="sr-only">
          Your LinkDrop username
        </label>
        {/* visually hidden label so the visible prefix is not read twice */}
        <span
          aria-hidden="true"
          className="rounded-l-lg border border-r-0 border-border-subtle bg-white px-4 py-3 text-sm font-medium text-secondary"
        >
          linkdrop.co/
        </span>
        <input
          id={inputId}
          type="text"
          placeholder="yourname"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-40 rounded-r-lg border border-border-subtle bg-white px-4 py-3 text-sm text-primary placeholder:text-secondary/60 focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:ring-offset-2 focus:ring-offset-background-primary sm:w-48"
        />
        <button
          type="submit"
          className="ml-3 rounded-lg border border-transparent bg-brand-green px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-green-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/30 focus-visible:ring-offset-2"
        >
          Get started for free
        </button>
      </form>

      <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-secondary">
        <Check className="h-3.5 w-3.5 text-brand-green" aria-hidden="true" />
        No credit card required. Free forever.
      </p>
    </div>
  );
}
