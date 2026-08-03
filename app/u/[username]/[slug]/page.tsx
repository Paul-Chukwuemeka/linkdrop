import { getPublishedCard } from "@/lib/public-card";
import { PublicCardView } from "@/components/profile/PublicCardView";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string; slug: string }>;
}): Promise<Metadata> {
  const { username, slug } = await params;
  try {
    const card = await getPublishedCard(username, slug);

    const title = `${card.name} | LinkForge`;
    const description = card.bio || `Links by @${username}`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: "profile",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
      },
    };
  } catch {
    return { title: "LinkForge" };
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ username: string; slug: string }>;
}) {
  const { username, slug } = await params;
  const card = await getPublishedCard(username, slug);

  return <PublicCardView card={card} />;
}