import { prisma } from "@/lib/db";
import { buildCardItemsList } from "@/lib/card-utils";
import { Card } from "@/lib/types";
import { isLight, darken, lighten } from "@/utils/colors";
import { PublicProfileHeader } from "@/components/profile/PublicProfileHeader";
import { PublicLinkCard } from "@/components/links/PublicLinkCard";
import { PublicCollection } from "@/components/collections/PublicCollection";
import { fonts } from "@/lib/fonts";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { DEFAULT_CARD_STYLE } from "@/lib/constants";

const getCard = cache(async (username: string): Promise<Card> => {
  const user = await prisma.user.findFirst({
    where: { username: { equals: username, mode: "insensitive" } },
  });

  if (!user) notFound();

  if (!user.currentCard) {
    return {
      id: null as unknown as string,
      user_id: user.id,
      name: "Untitled",
      items_list: [],
      bio: user.bio,
      style: { bg_type: "solid", card_bg: "ffffff", text_color: "000000", gradient: [], gradient_type: "linear", gradient_direction: 135, button_bg: "000000", button_color: "ffffff", button_type: "solid", button_radius: "pill", text_size: "medium", title_size: "medium", font_style: "Plus Jakarta Sans", shadow: "none", shadow_color: null, title_color: null, profile_image: null },
      user: { id: user.id, username: user.username, fullname: user.fullname, bio: user.bio, avatar_url: user.avatarUrl },
    };
  }

  const card = await prisma.card.findUnique({ where: { id: user.currentCard } });
  if (!card) notFound();

  const itemsList = await buildCardItemsList(card.id);

  return {
    id: card.id,
    user_id: card.userId,
    name: card.name,
    bio: card.bio ?? user.bio,
    items_list: itemsList as unknown as Card["items_list"],
    style: card.style as unknown as Card["style"],
    user: { id: user.id, username: user.username, fullname: user.fullname, bio: user.bio, avatar_url: user.avatarUrl },
  }
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  try {
    const card = await getCard(username);

    const title = `${card.user?.fullname || username} | LinkForge`;
    const description = card.bio || `Links by @${username}`;
    
    const ogImage = card.user?.avatar_url;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: "profile",
        ...(ogImage
          ? {
              images: [
                {
                  url: ogImage,
                  width: 800,
                  height: 800,
                  alt: `${username}'s profile image`,
                },
              ],
            }
          : {}),
      },
      twitter: ogImage
        ? {
            card: "summary_large_image",
            title,
            description,
            images: [ogImage],
          }
        : { card: "summary", title, description },
    };
  } catch {
    return { title: "LinkForge" };
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const card = await getCard(username);

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
              Join LinkForge
            </Link>
          </div>
        </div>

        <div
          className="mt-6 text-center text-xs opacity-60"
          style={{ color: `#${textColor}` }}
        >
        </div>
      </div>
    </div>
  );
}
