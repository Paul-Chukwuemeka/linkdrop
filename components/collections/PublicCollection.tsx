"use client";

import { Collection, CardTheme } from "@/lib/types";
import { PublicLinkCard } from "../links/PublicLinkCard";

export function PublicCollection({
  collection,
  cardStyle,
}: {
  collection: Collection;
  cardStyle: CardTheme;
}) {
  const links = collection.links;

  if (links.length === 0) return null;

  const textColor = cardStyle.text_color
    ? `#${cardStyle.text_color}`
    : "#ffffff";

  return (
    <div className="flex flex-col gap-3">
      {/* Collection Title */}
      <h3
        className="text-center font-bold text-lg tracking-tight px-4"
        style={{ color: textColor }}
      >
        {collection.title}
      </h3>

      {/* Links */}
      <div className="flex flex-col gap-4">
        {links.map((link, i) => (
          <PublicLinkCard key={i} link={link} cardStyle={cardStyle} />
        ))}
      </div>
    </div>
  );
}
