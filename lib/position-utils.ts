import { prisma } from "@/lib/db"

export async function getMaxPosition(cardId: string, collectionId: string | null): Promise<number> {
  if (collectionId) {
    const result = await prisma.link.aggregate({
      where: { cardId, collectionId },
      _max: { position: true },
    })
    return (result._max.position ?? -1) + 1
  }

  const [maxLink, maxCollection] = await Promise.all([
    prisma.link.aggregate({
      where: { cardId, collectionId: null },
      _max: { position: true },
    }),
    prisma.collection.aggregate({
      where: { cardId },
      _max: { position: true },
    }),
  ])

  return Math.max(maxLink._max.position ?? -1, maxCollection._max.position ?? -1) + 1
}
