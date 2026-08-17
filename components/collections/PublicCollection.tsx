"use client";

import { Collection, CardTheme } from "@/lib/types";
import { PublicLinkCard } from "../links/PublicLinkCard";
import { getButtonBgStyle, getLinkLayout } from "@/lib/style-mappings";

export function PublicCollection({
  collection,
  cardStyle,
}: {
  collection: Collection;
  cardStyle: CardTheme;
}) {
  const links = collection.links;

  if (links.length === 0) return null;

  const textColor = cardStyle.button_color
    ? `#${cardStyle.button_color}`
    : "#000000";

  const buttonBgStyle = getButtonBgStyle(cardStyle);
  const isGrid = getLinkLayout(cardStyle) === "grid";

  return (
    <div
      className="flex flex-col rounded-[14px] px-2.5 pt-3.5 pb-2.5 overflow-visible"
      style={buttonBgStyle}
    >
      <h3
        className="text-center capitalize font-bold text-lg tracking-tight px-4 mb-2"
        style={{ color: textColor }}
      >
        {collection.title}
      </h3>

      <div className={isGrid ? "grid grid-cols-2 gap-2" : "flex flex-col gap-2"}>
        {links.map((link, i) => (
          <PublicLinkCard key={i} link={link} cardStyle={cardStyle} />
        ))}
      </div>
    </div>
  );
}
