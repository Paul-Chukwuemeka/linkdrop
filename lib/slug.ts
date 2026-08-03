import { prisma } from "@/lib/db"

/**
 * Slugifies a card name into a URL-safe slug: lowercase, non-alphanumerics
 * become hyphens, runs of hyphens collapse, and edge hyphens are trimmed.
 * Falls back to "untitled" for names that contain nothing usable.
 */
export function slugify(input: string): string {
  const slug = input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
  return slug || "untitled"
}

/**
 * Returns a slug that is unique for a given user, appending "-2", "-3", … to
 * the base slug derived from `name` until no collision remains. Pass
 * `excludeCardId` to skip the card being updated (e.g. when renaming it).
 */
export async function getUniqueCardSlug(
  userId: string,
  name: string,
  excludeCardId?: string,
): Promise<string> {
  const base = slugify(name)
  const existing = await prisma.card.findMany({
    where: { userId },
    select: { id: true, slug: true },
  })
  const used = new Set(
    existing.flatMap((card) =>
      card.id !== excludeCardId && card.slug
        ? [card.slug.toLowerCase()]
        : [],
    ),
  )

  if (!used.has(base)) return base

  let i = 2
  let candidate = `${base}-${i}`
  while (used.has(candidate)) {
    i += 1
    candidate = `${base}-${i}`
  }
  return candidate
}
