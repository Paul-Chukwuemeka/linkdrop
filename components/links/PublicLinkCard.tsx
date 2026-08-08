"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState } from "react";
import { Link as LinkType, CardTheme } from "@/lib/types";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { getDomain, safeHref } from "@/utils/validate";
import { PublicbuttonRadiusClasses, getShadowStyles, getButtonBgStyle } from "@/lib/style-mappings";

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

function getShadowStyle(cardStyle: CardTheme): React.CSSProperties {
  const shadowKey = cardStyle.shadow ?? "hard";
  const shadowColor = cardStyle.shadow_color || cardStyle.button_color;
  const styles = getShadowStyles(shadowColor);
  if (cardStyle.button_type === "outline") {
    const { boxShadow } = styles[shadowKey];
    return { boxShadow };
  }
  return styles[shadowKey];
}

export function PublicLinkCard({
  link,
  cardStyle,
}: {
  link: LinkType;
  cardStyle: CardTheme;
}) {
  const domain = getDomain(link.url);
  const buttonBgStyle = getButtonBgStyle(cardStyle);
  const shadowStyle = getShadowStyle(cardStyle);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const textColor = cardStyle.button_color
    ? `#${cardStyle.button_color}`
    : "#000000";

  useEffect(() => {
    if (!menuOpen) return;
    function onPointerDown(e: MouseEvent | TouchEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  async function handleCopyLink() {
    const ok = await copyToClipboard(link.url);
    if (ok) {
      toast.success("Link copied");
    } else {
      toast.error("Could not copy link");
    }
    setMenuOpen(false);
  }

  function handleOpenInNewTab() {
    window.open(link.url, "_blank", "noopener,noreferrer");
    setMenuOpen(false);
  }

  return (
    <Link
      href={safeHref(link.url)}
      className={`group relative w-full px-5 h-14 font-semibold capitalize flex items-center justify-between transition-transform hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none ${PublicbuttonRadiusClasses[cardStyle.button_radius ?? "round"]} ${menuOpen ? "z-50" : ""}`}
      style={{ ...buttonBgStyle, ...shadowStyle }}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="flex items-center gap-4 flex-1 min-w-0">
        {/* Favicon */}
        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shrink-0 overflow-hidden border border-black/10">
          <img
            width={40}
            height={40}
            className="w-full h-full object-contain"
            alt=""
            src={`https://www.google.com/s2/favicons?domain=${domain}&sz=${128}`}
            onError={(e) => {
              e.currentTarget.src = "/globe.svg";
            }}
          />
        </div>

        {/* Title - centered */}
        <p
          className="flex-1 text-center truncate px-2 text-sm sm:text-base"
          style={{ color: textColor }}
        >
          {link.title}
        </p>
      </div>

      {/* Three dots menu */}
      <div ref={menuRef} className="relative shrink-0">
        <button
          className="p-2 opacity-60 hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setMenuOpen((open) => !open);
          }}
          aria-label="More options"
          aria-haspopup="menu"
          aria-expanded={menuOpen}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="currentColor"
            style={{ color: textColor }}
          >
            <circle cx="12" cy="6" r="2" />
            <circle cx="12" cy="12" r="2" />
            <circle cx="12" cy="18" r="2" />
          </svg>
        </button>

        {menuOpen && (
          <div
            role="menu"
            className="absolute right-0 top-full mt-2 z-1000 min-w-44 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 shadow-lg overflow-hidden"
          >
            <button
              role="menuitem"
              className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-neutral-900 dark:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                void handleCopyLink();
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              Copy link
            </button>
            <button
              role="menuitem"
              className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-neutral-900 dark:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleOpenInNewTab();
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              Open in new tab
            </button>
          </div>
        )}
      </div>
    </Link>
  );
}
