import { NextResponse } from "next/server"
import { auth } from "@/lib/auth-config"
import { prisma } from "@/lib/db"
import { unauthorizedResponse, notFoundResponse } from "@/lib/api-utils"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return unauthorizedResponse()

  const cards = await prisma.card.findMany({
    where: { userId: session.user.id },
    include: {
      links: true,
      collections: { include: { links: true } },
    },
    orderBy: { id: "asc" },
  })

  return NextResponse.json(
    cards.map((card) => ({
      id: card.id,
      user_id: card.userId,
      name: card.name,
      bio: card.bio,
      style: card.style,
      links: card.links.map((l) => ({
        id: l.id, card_id: l.cardId, collection_id: l.collectionId,
        title: l.title, url: l.url, position: l.position,
      })),
      collections: card.collections.map((c) => ({
        id: c.id, card_id: c.cardId, title: c.title, position: c.position,
        links: c.links.map((l) => ({
          id: l.id, card_id: l.cardId, collection_id: l.collectionId,
          title: l.title, url: l.url, position: l.position,
        })),
      })),
    }))
  )
}
