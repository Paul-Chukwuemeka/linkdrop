"use client";

import { Collection, CardTheme } from "@/lib/types";
import { PublicLinkCard } from "../links/PublicLinkCard";
import { isLight, lighten, darken } from "@/utils/colors";

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

  const bgColor = cardStyle.card_bg || "ffffff";
  const pageLight = isLight(bgColor);
  const wrapperBg = pageLight ? darken(bgColor, 0.05) : lighten(bgColor, 0.1);
  const borderColor = pageLight ? "#d0d0d0" : "#454545";

  return (
    <div
      className="flex flex-col rounded-[14px] px-[10px] pt-[14px] pb-[10px]"
      style={{
        backgroundColor: `#${wrapperBg}`,
        border: `0.5px solid ${borderColor}`,
      }}
    >
      {/* Collection Title */}
      <h3
        className="text-center font-bold text-lg tracking-tight px-4 mb-2"
        style={{ color: textColor }}
      >
        {collection.title}
      </h3>

      {/* Links */}
      <div className="flex flex-col gap-2">
        {links.map((link, i) => (
          <PublicLinkCard key={i} link={link} cardStyle={cardStyle} />
        ))}
      </div>
    </div>
  );
}
