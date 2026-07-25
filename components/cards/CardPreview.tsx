import Image from "next/image";
import { useContext, useMemo } from "react";
import { useProfile } from "@/context/ProfileContext";
import { useCard } from "@/context/CardContext";
import { useStyle } from "@/context/StyleContext";
import LinkPreview from "../links/LinkPreview";
import CollectionPreview from "../collections/collectionPreview";
import { fonts } from "@/lib/fonts";
import { isLight, darken, lighten } from "@/utils/colors";
import {
  titleSizeClasses,
  textSizeClasses,
  shadowStyles,
} from "@/lib/style-mappings";

const CardPreview = ({ mobile }: { mobile?: boolean }) => {
  const { profile } = useProfile();
  const { currentCard, isPreview, setIsPreview } = useCard();
  const { cardStyle } = useStyle();

  const items = currentCard?.items_list;

  const backgroundColor = cardStyle?.card_bg ?? "ffffff";

  const endColor = useMemo(
    () =>
      isLight(backgroundColor)
        ? darken(backgroundColor, 0.9)
        : lighten(backgroundColor, 0.9),
    [backgroundColor],
  );

  const currentFont = useMemo(
    () =>
      fonts.find(
        (f) => f.name.toLowerCase() === cardStyle?.font_style?.toLowerCase(),
      ) ?? fonts[0],
    [cardStyle?.font_style],
  );

  if (!cardStyle) return null;

  return (
    <div
      className={`flex items-center flex-col justify-center relative w-full ${mobile ? "h-auto max-h-[85vh]" : "h-full md:h-auto"}`}
      onClick={() => {
        if (mobile) {
          setIsPreview(false);
        }
      }}
    >
      {isPreview && mobile && (
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
        className={`shadow-(--shadow-card) rounded-xl sm:rounded-lg p-2 sm:p-1 sm:py-2 ring-1 ring-black/10 overflow-hidden ${mobile ? "w-full max-w-94 h-full min-h-200 " : "w-[320px] h-140"}`}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: `#${backgroundColor}`,
          ...(cardStyle.bg_type === "solid" && {
            background: `#${cardStyle.card_bg}`,
          }),
          ...(cardStyle.bg_type === "gradient" && {
            background: (() => {
              const colors =
                cardStyle.gradient && cardStyle.gradient.length >= 2
                  ? cardStyle.gradient.map((c) => `#${c}`).join(", ")
                  : `#${cardStyle.card_bg}, #${endColor}`;

              if (cardStyle.gradient_type === "radial") {
                return `radial-gradient(circle, ${colors})`;
              }
              return `linear-gradient(${cardStyle.gradient_direction ?? 135}deg, ${colors})`;
            })(),
          }),
          ...(cardStyle.bg_type === "image" &&
            cardStyle.profile_image && {
              backgroundImage: `url(${cardStyle.profile_image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }),
        }}
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
              className={`${mobile ? "" :""}  shrink-0 border rounded-full bg-white/40 ring-1 ring-black/10 object-cover`}
            />
            <p
              className={`font-black ${titleSizeClasses[cardStyle.title_size ?? "medium"]}`}
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
              className={`font-semibold ${textSizeClasses[cardStyle.text_size ?? "medium"]}`}
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
                className={`font-semibold text-center px-2 sm:px-4 ${textSizeClasses[cardStyle.text_size ?? "medium"]}`}
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
              className={`w-full flex gap-2 sm:gap-2.5 p-1 sm:p-2 flex-col flex-1 ${textSizeClasses[cardStyle.text_size ?? "medium"]}`}
              style={{
                color: cardStyle.text_color
                  ? `#${cardStyle.text_color}`
                  : undefined,
              }}
            >
              {items?.map((item, i) => {
                return item.type == "link" ? (
                  <LinkPreview
                    key={i}
                    item={item.content}
                    cardStyle={cardStyle}
                  />
                ) : (
                  <CollectionPreview
                    key={i}
                    item={item.content}
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
