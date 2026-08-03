import { prisma } from "@/lib/db";
import { buildCardItemsList } from "@/lib/card-utils";
import { Card } from "@/lib/types";
import { DEFAULT_CARD_STYLE } from "@/lib/constants";
import { notFound } from "next/navigation";
import { cache } from "react";

interface PublicUserRow {
  id: string;
  username: string;
  fullname: string | null;
  bio: string | null;
  avatarUrl: string | null;
}

function serializePublicCard(
  card: {
    id: string;
    name: string;
    bio: string | null;
    slug: string | null;
    isPublic: boolean;
    style: unknown;
  },
  user: PublicUserRow,
  itemsList: unknown,
  fallbackName = "Untitled",
): Card {
  return {
    id: card.id,
    user_id: user.id,
    name: card.name || fallbackName,
    bio: card.bio ?? user.bio,
    slug: card.slug,
    is_public: card.isPublic,
    items_list: itemsList as Card["items_list"],
    style: { ...DEFAULT_CARD_STYLE, ...(card.style ?? {}) } as unknown as Card["style"],
    user: {
      id: user.id,
      username: user.username,
      fullname: user.fullname,
      bio: user.bio,
      avatar_url: user.avatarUrl,
    },
  };
}

export const getPublicCard = cache(async (username: string): Promise<Card> => {
  const user = await prisma.user.findFirst({
    where: { username: { equals: username, mode: "insensitive" } },
  });

  if (!user) notFound();

  if (!user.currentCard) {
    return serializePublicCard(
      {
        id: null as unknown as string,
        name: "",
        bio: null,
        slug: null,
        isPublic: false,
        style: {},
      },
      user,
      [],
      "Untitled",
    );
  }

  const card = await prisma.card.findUnique({ where: { id: user.currentCard } });
  if (!card) notFound();

  const itemsList = await buildCardItemsList(card.id);

  return serializePublicCard(card, user, itemsList);
});

export const getPublishedCard = cache(
  async (username: string, slug: string): Promise<Card> => {
    const user = await prisma.user.findFirst({
      where: { username: { equals: username, mode: "insensitive" } },
    });

    if (!user) notFound();

    const card = await prisma.card.findFirst({
      where: { userId: user.id, slug, isPublic: true },
    });
    if (!card) notFound();

    const itemsList = await buildCardItemsList(card.id);

    return serializePublicCard(card, user, itemsList);
  },
);