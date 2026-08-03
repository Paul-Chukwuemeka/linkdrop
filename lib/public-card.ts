import { prisma } from "@/lib/db";
import { buildCardItemsList } from "@/lib/card-utils";
import { Card } from "@/lib/types";
import { notFound } from "next/navigation";
import { cache } from "react";

export const getCard = cache(async (username: string): Promise<Card> => {
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
