"use client";


import type { Collection, Link as LinkType } from "@/lib/types";
import React, { useMemo } from "react";

export type PreviewItem =
  | { type: "link"; link: LinkType }
  | { type: "collection"; collection: Collection; links: LinkType[] };

function PreviewLinkCard({ link }: { link: LinkType }) {
  return (
    <div
      className="flex w-full items-center justify-center gap-3 rounded-full px-6 py-4 text-center text-sm font-semibold"
      style={{
        background: "var(--link-bg)",
        color: "var(--link-color)",
        border: "var(--link-border)",
      }}
    >
      <span className="truncate">{link.title}</span>
    </div>
  );
}

export function PreviewFrame({
  profile,
  cardName,
  items,
}: {
  profile: {
    username: string;
    fullname: string;
    bio: string | null;
    avatar_url: string | null;
  };
  cardName: string;
  items: PreviewItem[];
}) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-(--shadow-card) ring-1 ring-(--color-border)">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="text-sm font-bold text-neutral-900">Live preview</div>
          <div className="mt-1 truncate text-xs text-neutral-600">
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
          className="min-h-[560px] bg-(--page-bg) px-5 pb-10"
        >
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <div className="h-16 w-16 overflow-hidden rounded-full bg-white/40 ring-1 ring-black/10">
              {profile.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.avatar_url}
                  alt={profile.fullname || profile.username}
                  className="h-full w-full object-cover"
                />
              ) : null}
            </div>
            <div className="text-lg font-black text-neutral-900">
              {profile.fullname || profile.username || "Your Name"}
            </div>
            <div className="text-xs font-semibold text-neutral-700">
              {profile.username ? `@${profile.username}` : "—"}
            </div>
            {profile.bio ? (
              <div className="max-w-[260px] text-xs text-neutral-800/80">
                {profile.bio}
              </div>
            ) : null}
          </div>

          <div className="flex flex-col gap-4">
            {items.map((item) => {
              if (item.type === "link") {
                return <PreviewLinkCard key={item.link.id} link={item.link} />;
              }

              return (
                <div key={item.collection.id} className="flex flex-col gap-3">
                  <div className="text-center text-xs font-extrabold tracking-wide text-neutral-900">
                    {item.collection.title}
                  </div>
                  <div className="flex flex-col gap-3">
                    {item.links.map((link) => (
                      <PreviewLinkCard key={link.id} link={link} />
                    ))}
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
