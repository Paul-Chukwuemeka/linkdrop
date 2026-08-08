"use client";

import { useProfile } from "@/context/ProfileContext";
import { Check, Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";

async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(textarea);
      return ok;
    } catch {
      return false;
    }
  }
}

export function PublicUrlBar() {
  const { profile } = useProfile();
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const username = profile?.username;
  if (!username) return null;

  const urlBarSiteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const realUrl = `${urlBarSiteUrl.replace(/\/+$/, "")}/u/${encodeURIComponent(username)}`;

  async function handleCopy() {
    const ok = await copyToClipboard(realUrl);
    if (!ok) return;
    setCopied(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="sticky top-0 z-50 bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-800 px-6 py-3 flex items-center justify-between">
      <a
        href={`/u/${encodeURIComponent(username)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="min-w-0 text-sm font-medium text-gray-900 dark:text-neutral-100 hover:text-brand-green transition-colors"
      >
        <span className="text-gray-400 dark:text-neutral-500">linkdrop.co/</span>
        <span className="truncate">{username}</span>
      </a>
      <button
        onClick={handleCopy}
        aria-label="Copy profile URL"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-[#1B3A1B] hover:text-[#2A502A] dark:text-[#7ece7e] dark:hover:text-[#9fe39f] transition-colors shrink-0"
      >
        {copied ? (
          <>
            <Check className="w-4 h-4" />
            Copied!
          </>
        ) : (
          <>
            <Copy className="w-4 h-4" />
            <span className="hidden sm:inline">Copy</span>
          </>
        )}
      </button>
    </div>
  );
}