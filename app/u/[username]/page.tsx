import { getPublicCard } from "@/lib/public-card";
import { PublicCardView } from "@/components/profile/PublicCardView";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  try {
    const card = await getPublicCard(username);

    const title = `${card.user?.fullname || username} | LinkDrop`;
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
    return { title: "LinkDrop" };
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const card = await getPublicCard(username);

  return <PublicCardView card={card} />;
}