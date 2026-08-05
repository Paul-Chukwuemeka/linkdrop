import { getPublicCard } from "@/lib/public-card";
import { buildCardOGImage, ogSize } from "@/components/profile/PublicCardOpenGraph";

export const alt = "LinkDrop profile";
export const size = ogSize;
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const card = await getPublicCard(username);
  return buildCardOGImage(card, username);
}