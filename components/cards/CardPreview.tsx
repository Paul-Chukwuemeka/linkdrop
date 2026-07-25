"use client";

import Image from "next/image";
import { useMemo } from "react";
import { useProfile } from "@/context/ProfileContext";
import { useCard } from "@/context/CardContext";
import { useStyle } from "@/context/StyleContext";
import { PublicProfileHeader } from "@/components/profile/PublicProfileHeader";
import { PublicLinkCard } from "@/components/links/PublicLinkCard";
import { PublicCollection } from "@/components/collections/PublicCollection";
import { fonts } from "@/lib/fonts";
import { isLight, darken, lighten } from "@/utils/colors";

const CardPreview = ({ mobile }: { mobile?: boolean }) => {
  const { profile } = useProfile();
  const { currentCard, isPreview, setIsPreview } = useCard();
  const { cardStyle } = useStyle();

  const items = currentCard?.items_list;

  const backgroundColor = cardStyle?.card_bg ?? "ffffff";

  const gradientColors = useMemo(() => {
    if (cardStyle?.gradient && cardStyle.gradient.length >= 2) {
      return cardStyle.gradient;
    }
    return [
      backgroundColor,
      isLight(backgroundColor)
        ? darken(backgroundColor, 0.8)
        : lighten(backgroundColor, 0.8),
    ];
  }, [backgroundColor, cardStyle?.gradient]);

  const backgroundStyle: React.CSSProperties = useMemo(() => {
    if (!cardStyle) return {};
    if (cardStyle.bg_type === "solid") {
      return { background: `#${cardStyle.card_bg}` };
    }
    if (cardStyle.bg_type === "gradient") {
      const colors = gradientColors.map((c) => `#${c}`).join(", ");
      if (cardStyle.gradient_type === "radial") {
        return { background: `radial-gradient(circle at center, ${colors})` };
      }
      return {
        background: `linear-gradient(${cardStyle.gradient_direction ?? 135}deg, ${colors})`,
      };
    }
    if (cardStyle.bg_type === "image" && cardStyle.profile_image) {
      return {
        backgroundImage: `url(${cardStyle.profile_image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      };
    }
    return { background: `#${cardStyle.card_bg}` };
  }, [cardStyle, gradientColors]);

  const currentFont = useMemo(
    () =>
      fonts.find(
        (f) => f.name.toLowerCase() === cardStyle?.font_style?.toLowerCase(),
      ) ?? fonts[0],
    [cardStyle?.font_style],
  );

  const textColor = cardStyle?.text_color || "ffffff";

  if (!cardStyle) return null;

  if (mobile) {
    return (
      <div
        className={`flex items-center flex-col justify-center relative w-full h-auto max-h-[85vh]`}
        onClick={() => setIsPreview(false)}
      >
        {isPreview && (
          <button
            className="absolute z-10 top-2 right-2 bg-white/90 backdrop-blur px-4 py-2 text-sm font-semibold rounded-full shadow-lg transition-colors hover:bg-white"
            onClick={(e) => {
              e.stopPropagation();
              setIsPreview(false);
            }}
            aria-label="Close preview"
          >
            Close
          </button>
        )}
        <div
          className={`w-full max-w-94 h-full min-h-200 rounded-xl overflow-hidden ring-1 ring-black/10 ${currentFont?.font?.className || ""}`}
          style={backgroundStyle}
        >
          <div className="rounded-3xl w-full p-6">
            <PublicProfileHeader
              fullname={profile?.fullname || ""}
              username={profile?.username || ""}
              bio={profile?.bio || null}
              avatarUrl={profile?.avatar_url || null}
              title_size={cardStyle.title_size}
              text_size={cardStyle.text_size}
              text_color={textColor}
              title_color={cardStyle.title_color || textColor}
            />

            <div className="mt-8 flex flex-col gap-4">
              {items?.map((item, i) =>
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
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center flex-col justify-center relative w-full h-full md:h-auto`}
    >
      <div
        className={`shadow-(--shadow-card) rounded-xl sm:rounded-lg p-2 sm:p-1 sm:py-2 ring-1 ring-black/10 overflow-hidden w-[320px] h-140`}
        style={backgroundStyle}
      >
        <div
          className={`h-full overflow-y-auto preview p-2 sm:p-1 sm:pb-5 lg:p-2 ${currentFont.font.className}`}
        >
          <div className="flex flex-col items-center gap-2 sm:gap-3 h-fit py-3 sm:py-4 text-center">
            <Image
              src={profile?.avatar_url || "/user.svg"}
              alt="user"
              width={100}
              height={100}
              className="h-20 w-20 shrink-0 rounded-full bg-white/40 ring-1 ring-black/10 object-cover"
            />
            <p
              className="font-black text-lg"
              style={{
                color: cardStyle.title_color
                  ? `#${cardStyle.title_color}`
                  : cardStyle.text_color
                    ? `#${cardStyle.text_color}`
                    : undefined,
              }}
            >
              {profile?.fullname}
            </p>
            <p
              className="font-semibold text-xs"
              style={{
                color: cardStyle.text_color
                  ? `#${cardStyle.text_color}`
                  : undefined,
              }}
            >
              @{profile?.username}
            </p>

            {profile?.bio && (
              <p
                className="font-semibold text-center px-2 sm:px-4 text-xs"
                style={{
                  color: cardStyle.text_color
                    ? `#${cardStyle.text_color}`
                    : undefined,
                }}
              >
                {profile.bio}
              </p>
            )}

            <div
              className="w-full flex gap-2 sm:gap-2.5 p-1 sm:p-2 flex-col flex-1 text-xs"
              style={{
                color: cardStyle.text_color
                  ? `#${cardStyle.text_color}`
                  : undefined,
              }}
            >
              {items?.map((item, i) => {
                return item.type == "link" ? (
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
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardPreview;
