import { getPublishedCard } from "@/lib/public-card";
import { buildCardOGImage, ogSize } from "@/components/profile/PublicCardOpenGraph";

export const alt = "LinkForge card";
export const size = ogSize;
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ username: string; slug: string }>;
}) {
  const { username, slug } = await params;
  const card = await getPublishedCard(username, slug);
  return buildCardOGImage(card, username);
}