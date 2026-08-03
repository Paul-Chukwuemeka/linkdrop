import { ImageResponse } from "next/og";
import { getCard } from "@/lib/public-card";
import { Card } from "@/lib/types";
import { isLight, darken, lighten } from "@/utils/colors";
import { DEFAULT_CARD_STYLE } from "@/lib/constants";

export const alt = "LinkForge profile";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  const card = await getCard(username);

  const cardStyle = { ...DEFAULT_CARD_STYLE, ...card.style } as Card["style"];

  const gradientColors =
    cardStyle.gradient && cardStyle.gradient.length >= 2
      ? cardStyle.gradient
      : [
          cardStyle.card_bg,
          isLight(cardStyle.card_bg)
            ? darken(cardStyle.card_bg, 0.8)
            : lighten(cardStyle.card_bg, 0.8),
        ];

  let background = `#${cardStyle.card_bg}`;
  if (cardStyle.bg_type === "gradient") {
    background =
      cardStyle.gradient_type === "radial"
        ? `radial-gradient(circle at center, ${gradientColors.map((c) => `#${c}`).join(", ")})`
        : `linear-gradient(${cardStyle.gradient_direction ?? 135}deg, ${gradientColors.map((c) => `#${c}`).join(", ")})`;
  }

  const textColor = `#${cardStyle.text_color || "ffffff"}`;

  const fullname = card.user?.fullname || username;
  const bio = card.bio || null;
  const avatarUrl = card.user?.avatar_url || null;

  const linkItems = (card.items_list || [])
    .filter((item) => item.type === "link")
    .slice(0, 4)
    .map((item) => (item.type === "link" ? item.content.title : ""))
    .filter(Boolean) as string[];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background,
          padding: "64px",
          fontFamily: "geist",
          color: textColor,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          {avatarUrl && (
            <img
              src={avatarUrl}
              alt=""
              width={128}
              height={128}
              style={{
                borderRadius: "9999px",
                objectFit: "cover",
                border: `3px solid ${textColor}33`,
              }}
            />
          )}
          <div
            style={{
              fontSize: 48,
              fontWeight: 700,
              marginTop: avatarUrl ? 28 : 0,
            }}
          >
            {fullname}
          </div>
          <div style={{ fontSize: 28, opacity: 0.7, marginTop: 8 }}>
            @{username}
          </div>
          {bio && (
            <div style={{ fontSize: 24, opacity: 0.85, marginTop: 16 }}>
              {bio}
            </div>
          )}
          {linkItems.length > 0 && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
                marginTop: 36,
                width: 420,
              }}
            >
              {linkItems.map((title) => (
                <div
                  key={title}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 9999,
                    border: `2px solid ${textColor}55`,
                    padding: "14px 24px",
                    fontSize: 20,
                  }}
                >
                  {title}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
