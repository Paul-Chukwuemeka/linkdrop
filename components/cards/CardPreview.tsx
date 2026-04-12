import Image from "next/image";
import { useContext, useMemo } from "react";
import { AppContext } from "@/context/AppContext";
import LinkPreview from "../links/LinkPreview";
import CollectionPreview from "../collections/collectionPreview";
import { fonts } from "@/lib/fonts";
import { isLight, darken, lighten } from "@/utils/colors";
import { titleSizeClasses, textSizeClasses, shadowStyles } from "@/lib/style-mappings";

const CardPreview = () => {
  const { profile, currentCard, cardStyle } = useContext(AppContext)!;

  const items = currentCard?.items_list;

  const backgroundColor = cardStyle ? cardStyle.card_bg : "ffffff";

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
      className="flex items-center justify-center relative w-full h-full md:h-auto"
    >
      <div
        className="mt-2 shadow-(--shadow-card) rounded-lg p-1 py-2 bg-(--page-bg) xl:w-70 w-70 h-140 ring-1 ring-black/10"
        style={{
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
            }),
        }}
      >
        <div
          className={`min-h-130 overflow-y-auto preview h-full p-1 pb-5 flex flex-col lg:p-2 ${currentFont.font.className}`}
        >
          <div className="flex *:shrink-0 flex-col items-center gap-2 h-fit py-4 text-center">
            <Image
              src={"/user.svg"}
              alt="user"
              width={100}
              height={100}
              className="h-12 w-12 shrink-0 border rounded-full bg-white/40 ring-1 ring-black/10"
            />
            <p
              className={`font-black ${titleSizeClasses[cardStyle.title_size ?? "medium"]}`}
              style={{
                color: cardStyle.title_color
                  ? `#${cardStyle.title_color}`
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

            <p
              className={`font-semibold text-center px-4 ${textSizeClasses[cardStyle.text_size ?? "medium"]}`}
              style={{
                color: cardStyle.text_color
                  ? `#${cardStyle.text_color}`
                  : undefined,
              }}
            >
              {profile?.bio}
            </p>

            <div
              className={`w-full flex gap-2.5 p-2 flex-col flex-1 ${textSizeClasses[cardStyle.text_size ?? "medium"]}`}
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
