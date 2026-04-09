import { CollectionBlock } from "@/components/collections/CollectionBlock";
import { LinkCard } from "@/components/links/LinkCard";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { resolveThemeVars, themeVarsToStyle } from "@/lib/theme";
import type { Card, Collection, Link, UserProfilePublic } from "@/lib/types";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

async function fetchProfile(username: string): Promise<UserProfilePublic> {
  const base = process.env.NEXT_PUBLIC_API_URL;
  if (!base) throw new Error("NEXT_PUBLIC_API_URL is not set");

  const res = await fetch(new URL(`/profile/${encodeURIComponent(username)}`, base), {
    cache: "no-store",
  });

  if (res.status === 404) notFound();
  if (!res.ok) throw new Error("Failed to load profile");
  return (await res.json()) as UserProfilePublic;
}

function buildTopLevelItems(card: Card): Array<
  | { type: "link"; position: number; link: Link }
  | { type: "collection"; position: number; collection: Collection }
> {
  const links = (card.links || []).filter((l) => l.collection_id === null);
  const collections = card.collections || [];

  const items = [
    ...collections.map((collection) => ({
      type: "collection" as const,
      position: collection.position,
      collection,
    })),
    ...links.map((link) => ({
      type: "link" as const,
      position: link.position,
      link,
    })),
  ];

  items.sort((a, b) => {
    if (a.position !== b.position) return a.position - b.position;
    return a.type === "collection" ? -1 : 1;
  });

  return items;
}

function linksByCollection(card: Card): Record<string, Link[]> {
  const map: Record<string, Link[]> = {};
  for (const link of card.links || []) {
    if (!link.collection_id) continue;
    map[link.collection_id] ||= [];
    map[link.collection_id].push(link);
  }
  for (const id of Object.keys(map)) {
    map[id].sort((a, b) => a.position - b.position);
  }
  return map;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  try {
    const profile = await fetchProfile(username);
    const title = `${profile.fullname} (@${profile.username})`;
    const description = profile.bio || `Links by @${profile.username}`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
      },
    };
  } catch {
    return { title: "LinkForge" };
  }
}

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const profile = await fetchProfile(username);
  const card = profile.cards?.[0] as Card | undefined;

  const vars = resolveThemeVars(profile.theme);
  const style = themeVarsToStyle(vars);

  if (!card) {
    return (
      <main className="min-h-dvh bg-(--page-bg) px-6" style={style}>
        <div className="mx-auto w-full max-w-md">
          <ProfileHeader
            fullname={profile.fullname}
            username={profile.username}
            bio={profile.bio}
            avatarUrl={profile.avatar_url}
          />
          <div className="rounded-3xl bg-white/70 p-6 text-center text-sm text-neutral-800 ring-1 ring-black/10">
            No cards yet.
          </div>
        </div>
      </main>
    );
  }

  const topItems = buildTopLevelItems(card);
  const byCollection = linksByCollection(card);

  return (
    <main className="min-h-dvh bg-(--page-bg) px-6" style={style}>
      <div className="mx-auto w-full max-w-md pb-16">
        <ProfileHeader
          fullname={profile.fullname}
          username={profile.username}
          bio={profile.bio}
          avatarUrl={profile.avatar_url}
        />

        <div className="flex flex-col gap-4">
          {topItems.map((item) => {
            if (item.type === "link") {
              return <LinkCard key={item.link.id} link={item.link} />;
            }

            const links = byCollection[item.collection.id] || [];
            return (
              <CollectionBlock
                key={item.collection.id}
                collection={item.collection}
                links={links}
              />
            );
          })}
        </div>
      </div>
    </main>
  );
}

