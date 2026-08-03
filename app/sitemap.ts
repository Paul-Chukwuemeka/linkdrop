import { prisma } from "@/lib/db";
import type { MetadataRoute } from "next";

export const dynamic = "force-dynamic";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const users = await prisma.user.findMany({
    where: { currentCard: { not: null } },
    select: { username: true, updatedAt: true },
  });

  const publishedCards = await prisma.card.findMany({
    where: { isPublic: true },
    select: {
      slug: true,
      updatedAt: true,
      user: { select: { username: true } },
    },
  });

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...users.map((user) => ({
      url: `${baseUrl}/u/${user.username}`,
      lastModified: user.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...publishedCards.map((card) => ({
      url: `${baseUrl}/u/${card.user.username}/${card.slug}`,
      lastModified: card.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
