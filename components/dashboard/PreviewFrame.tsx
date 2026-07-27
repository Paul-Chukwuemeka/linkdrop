"use client";


import type { Collection, Link as LinkType, CardTheme } from "@/lib/types";
import React, { useState } from "react";
import { getShadowStyles, PublicbuttonRadiusClasses } from "@/lib/style-mappings";

export type PreviewItem =
  | { type: "link"; link: LinkType }
  | { type: "collection"; collection: Collection; links: LinkType[] };

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

function getPreviewShadowStyle(cardStyle: CardTheme): React.CSSProperties {
  const shadowKey = cardStyle.shadow ?? "hard";
  const shadowColor = cardStyle.shadow_color || cardStyle.button_color;
  const styles = getShadowStyles(shadowColor);
  const { border, ...rest } = styles[shadowKey];
  if (cardStyle.button_type === "outline") {
    return rest;
  }
  return styles[shadowKey];
}

function PreviewLinkCard({ link, cardStyle }: { link: LinkType; cardStyle: CardTheme }) {
  const buttonBgStyle = getButtonBgStyle(cardStyle);
  const shadowStyle = getPreviewShadowStyle(cardStyle);
  const textColor = cardStyle.button_color
    ? `#${cardStyle.button_color}`
    : "#000000";
  const radiusClass = PublicbuttonRadiusClasses[cardStyle.button_radius ?? "round"];

  return (
    <div
      className={`flex w-full items-center justify-center gap-3 px-6 py-4 text-center text-sm font-semibold ${radiusClass}`}
      style={{ ...buttonBgStyle, ...shadowStyle, color: textColor }}
    >
      <span className="truncate">{link.title}</span>
    </div>
  );
}

export function PreviewFrame({
  profile,
  cardName,
  items,
  cardStyle,
}: {
  profile: {
    username: string;
    fullname: string;
    bio: string | null;
    avatar_url: string | null;
  };
  cardName: string;
  items: PreviewItem[];
  cardStyle?: CardTheme | null;
}) {
  const [imgError, setImgError] = useState(false);
  return (
    <div className="rounded-3xl bg-white dark:bg-neutral-900 p-6 shadow-(--shadow-card) ring-1 ring-(--border-color)">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="text-sm font-bold text-neutral-900 dark:text-neutral-100">Live preview</div>
          <div className="mt-1 truncate text-xs text-neutral-600 dark:text-neutral-400">
            {profile.username ? `@${profile.username}` : ""}{" "}
            {cardName ? `• ${cardName}` : ""}
          </div>
        </div>
        <div
          className="h-3 w-3 shrink-0 rounded-full"
          style={{ background: "var(--accent)" }}
        />
      </div>

      <div className="mt-4 overflow-hidden rounded-[28px] ring-1 ring-black/10">
        <div
          className="min-h-[560px] bg-(--bg-secondary) px-5 pb-10"
        >
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <div className="h-16 w-16 overflow-hidden rounded-full bg-white/40 dark:bg-neutral-700/40 ring-1 ring-black/10 dark:ring-white/10">
              {profile.avatar_url && !imgError ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.avatar_url}
                  alt={profile.fullname || profile.username}
                  className="h-full w-full object-cover"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-lg font-black text-neutral-900 dark:text-neutral-100">
                  {profile.fullname?.[0]?.toUpperCase() || profile.username?.[0]?.toUpperCase() || "?"}
                </div>
              )}
            </div>
            <div className="text-lg font-black text-neutral-900 dark:text-neutral-100">
              {profile.fullname || profile.username || "Your Name"}
            </div>
            <div className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              {profile.username ? `@${profile.username}` : "—"}
            </div>
            {profile.bio ? (
              <div className="max-w-[260px] text-xs text-neutral-800/80 dark:text-neutral-200/80">
                {profile.bio}
              </div>
            ) : null}
          </div>

          <div className="flex flex-col gap-4">
            {items.map((item) => {
              if (item.type === "link") {
                return cardStyle ? (
                  <PreviewLinkCard key={item.link.id} link={item.link} cardStyle={cardStyle} />
                ) : (
                  <div
                    key={item.link.id}
                    className="flex w-full items-center justify-center gap-3 rounded-full px-6 py-4 text-center text-sm font-semibold"
                    style={{
                      background: "var(--link-bg)",
                      color: "var(--link-color)",
                      border: "var(--link-border)",
                    }}
                  >
                    <span className="truncate">{item.link.title}</span>
                  </div>
                );
              }

              return (
                <div key={item.collection.id} className="flex flex-col gap-3">
                  <div className="text-center text-xs font-extrabold tracking-wide text-neutral-900 dark:text-neutral-100">
                    {item.collection.title}
                  </div>
                  <div className="flex flex-col gap-3">
                    {item.links.map((link) =>
                      cardStyle ? (
                        <PreviewLinkCard key={link.id} link={link} cardStyle={cardStyle} />
                      ) : (
                        <div
                          key={link.id}
                          className="flex w-full items-center justify-center gap-3 rounded-full px-6 py-4 text-center text-sm font-semibold"
                          style={{
                            background: "var(--link-bg)",
                            color: "var(--link-color)",
                            border: "var(--link-border)",
                          }}
                        >
                          <span className="truncate">{link.title}</span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
