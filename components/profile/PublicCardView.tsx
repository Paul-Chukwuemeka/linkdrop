import { Card } from "@/lib/types";
import { isLight, darken, lighten } from "@/utils/colors";
import { PublicProfileHeader } from "@/components/profile/PublicProfileHeader";
import { PublicLinkCard } from "@/components/links/PublicLinkCard";
import { PublicCollection } from "@/components/collections/PublicCollection";
import { fonts } from "@/lib/fonts";
import { DEFAULT_CARD_STYLE } from "@/lib/constants";
import Link from "next/link";

export function PublicCardView({ card }: { card: Card }) {
  const cardStyle = { ...DEFAULT_CARD_STYLE, ...card.style } as Card["style"];
  const items = card.items_list || [];

  const gradientColors =
    cardStyle.gradient && cardStyle.gradient.length >= 2
      ? cardStyle.gradient
      : [
          cardStyle.card_bg,
          isLight(cardStyle.card_bg)
            ? darken(cardStyle.card_bg, 0.8)
            : lighten(cardStyle.card_bg, 0.8),
        ];

  const currentFont =
    fonts.find(
      (f) => f.name.toLowerCase() === cardStyle.font_style?.toLowerCase(),
    ) ?? fonts[0];

  const backgroundStyle: React.CSSProperties =
    cardStyle.bg_type === "solid"
      ? { background: `#${cardStyle.card_bg}` }
      : cardStyle.bg_type === "gradient"
        ? {
            background:
              cardStyle.gradient_type === "radial"
                ? `radial-gradient(circle at center, ${gradientColors.map((c) => `#${c}`).join(", ")})`
                : `linear-gradient(${cardStyle.gradient_direction ?? 135}deg, ${gradientColors.map((c) => `#${c}`).join(", ")})`,
          }
        : cardStyle.bg_type === "image" && cardStyle.profile_image
          ? {
              backgroundImage: `url(${cardStyle.profile_image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : { background: `#${cardStyle.card_bg}` };

  const textColor = cardStyle.text_color || "ffffff";

  return (
    <div
      className="min-h-dvh w-full flex items-start overflow-y-auto bg-fixed"
      style={backgroundStyle}
    >
      <div
        className={`mx-auto max-w-160 w-full shrink-0 px-4 py-8 ${
          currentFont?.font?.className || ""
        }`}
      >
        <div
          className="rounded-3xl w-full shadow-(--shadow-card) backdrop-blur-sm p-6 sm:p-8"
          style={backgroundStyle}
        >
          <PublicProfileHeader
            fullname={card.user?.fullname || ""}
            username={card.user?.username || ""}
            bio={card.bio || null}
            avatarUrl={card.user?.avatar_url || null}
            title_size={cardStyle.title_size}
            text_size={cardStyle.text_size}
            text_color={textColor}
            title_color={cardStyle.title_color || textColor}
          />

          <div className="mt-4 flex flex-col gap-4">
            {items.map((item, i) =>
              item.type === "link" ? (
                <PublicLinkCard
                  key={i}
                  link={item.content}
                  cardStyle={cardStyle}
                />
              ) : (
                <PublicCollection
                  key={i}
                  collection={item.content}
                  cardStyle={cardStyle}
                />
              ),
            )}
          </div>

          <div className="mt-4 text-center">
            <div
              className="mx-auto mb-6 h-px w-16 opacity-20"
              style={{ backgroundColor: `#${textColor}` }}
            />
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-105"
            >
              Join LinkDrop
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
