import { prisma } from "@/lib/db"

export async function buildCardItemsList(cardId: string) {
  const collections = await prisma.collection.findMany({
    where: { cardId },
    include: {
      links: { orderBy: [{ position: "asc" }, { id: "asc" }] },
    },
    orderBy: [{ position: "asc" }, { id: "asc" }],
  })

  const links = await prisma.link.findMany({
    where: { cardId, collectionId: null },
    orderBy: [{ position: "asc" }, { id: "asc" }],
  })

  const items = [
    ...collections.map((c) => ({
      type: "collection" as const,
      position: c.position,
      content: c,
    })),
    ...links.map((l) => ({
      type: "link" as const,
      position: l.position,
      content: l,
    })),
  ].sort((a, b) => a.position - b.position)

  return items
}
