import type { Link as LinkType } from "@/lib/types";
import React from "react";

export function LinkCard({ link }: { link: LinkType }) {
  return (
    <a
      href={link.url}
      className="flex w-full items-center justify-center gap-3 rounded-full px-6 py-4 text-center text-sm font-semibold transition hover:opacity-90"
      style={{
        background: "var(--link-bg)",
        color: "var(--link-color)",
        border: "var(--link-border)",
      }}
      target="_blank"
      rel="noopener noreferrer"
    >
      <span className="truncate">{link.title}</span>
    </a>
  );
}

