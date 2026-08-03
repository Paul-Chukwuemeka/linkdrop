"use client";
/* eslint-disable @next/next/no-img-element */

import { Link as LinkType, CardTheme } from "@/lib/types";
import Link from "next/link";
import { getDomain, safeHref } from "@/utils/validate";
import { PublicbuttonRadiusClasses, getShadowStyles } from "@/lib/style-mappings";

function getButtonBgStyle(cardStyle: CardTheme): React.CSSProperties {
  if (cardStyle.button_type === "glass") {
    return {
      background: "rgba(255,255,255,0.3)",
      backdropFilter: "blur(5px)",
    };
  }
  if (cardStyle.button_type === "outline") {
    return {
      borderColor: cardStyle.button_bg
        ? `#${cardStyle.button_bg}`
        : "#000000",
      borderWidth: "2px",
      background: "transparent",
    };
  }
  if (cardStyle.button_bg) {
    return { backgroundColor: `#${cardStyle.button_bg}` };
  }
  return { backgroundColor: "#ffffff" };
}

function getShadowStyle(cardStyle: CardTheme): React.CSSProperties {
  const shadowKey = cardStyle.shadow ?? "hard";
  const shadowColor = cardStyle.shadow_color || cardStyle.button_color;
  const styles = getShadowStyles(shadowColor);
  const { border, ...rest } = styles[shadowKey];
  if (cardStyle.button_type === "outline") {
    return rest;
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

  const textColor = cardStyle.button_color
    ? `#${cardStyle.button_color}`
    : "#000000";

  return (
    <Link
      href={safeHref(link.url)}
      className={`group relative w-full px-5 h-14 font-semibold capitalize flex items-center justify-between transition-transform active:translate-x-[2px] active:translate-y-[2px] active:shadow-none ${PublicbuttonRadiusClasses[cardStyle.button_radius ?? "round"]}`}
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
      <button
        className="p-2 opacity-60 hover:opacity-100 transition-opacity shrink-0"
        onClick={(e) => e.preventDefault()}
        aria-label="More options"
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
    </Link>
  );
}
