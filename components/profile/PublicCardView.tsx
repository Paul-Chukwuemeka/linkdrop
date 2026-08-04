import { Card } from "@/lib/types";
import { buildCardBackground } from "@/lib/style-utils";
import { CardContent } from "@/components/cards/CardContent";
import { fonts } from "@/lib/fonts";
import { DEFAULT_CARD_STYLE } from "@/lib/constants";

export function PublicCardView({ card }: { card: Card }) {
  const cardStyle = { ...DEFAULT_CARD_STYLE, ...card.style } as Card["style"];
  const items = card.items_list || [];

  const currentFont =
    fonts.find(
      (f) => f.name.toLowerCase() === cardStyle.font_style?.toLowerCase(),
    ) ?? fonts[0];

  return (
    <div
      className="min-h-dvh w-full flex items-start overflow-y-auto bg-fixed"
      style={buildCardBackground(cardStyle)}
    >
      <div
        className={`mx-auto max-w-160 w-full shrink-0 px-4 py-8 ${
          currentFont?.font?.className || ""
        }`}
      >
        <CardContent
          fullname={card.user?.fullname || ""}
          username={card.user?.username || ""}
          bio={card.bio || null}
          avatarUrl={card.user?.avatar_url || null}
          items={items}
          cardStyle={cardStyle}
        />
      </div>
    </div>
  );
}