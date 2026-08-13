"use client";

import { ItemFromList, CardTheme } from "@/lib/types";
import { PublicLinkCard } from "./PublicLinkCard";
import { PublicCollection } from "../collections/PublicCollection";
import { getLinkLayout } from "@/lib/style-mappings";

export function LinksContainer({
  items,
  cardStyle,
  className = "",
}: {
  items: ItemFromList[];
  cardStyle: CardTheme;
  className?: string;
}) {
  const layout = getLinkLayout(cardStyle);

  const blocks: (ItemFromList | Extract<ItemFromList, { type: "link" }>[])[] = [];
  if (layout === "grid") {
    let group: Extract<ItemFromList, { type: "link" }>[] = [];
    items.forEach((item) => {
      if (item.type === "link") {
        group.push(item);
      } else {
        if (group.length > 0) {
          blocks.push(group);
          group = [];
        }
        blocks.push(item);
      }
    });
    if (group.length > 0) blocks.push(group);
  } else {
    items.forEach((item) => blocks.push(item));
  }

  return (
    <div className={`flex flex-col ${className}`}>
      {blocks.map((block, i) =>
        Array.isArray(block) ? (
          <div key={`grid-${i}`} className="grid grid-cols-2 gap-2 sm:gap-3">
            {block.map((item, j) => (
              <PublicLinkCard
                key={item.content.id ?? `link-${j}`}
                link={item.content}
                cardStyle={cardStyle}
              />
            ))}
          </div>
        ) : block.type === "link" ? (
          <PublicLinkCard
            key={block.content.id}
            link={block.content}
            cardStyle={cardStyle}
          />
        ) : (
          <PublicCollection
            key={block.content.id}
            collection={block.content}
            cardStyle={cardStyle}
          />
        ),
      )}
    </div>
  );
}
