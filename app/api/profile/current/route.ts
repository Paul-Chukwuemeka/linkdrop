import { NextResponse } from "next/server"
import { auth } from "@/lib/auth-config"
import { prisma } from "@/lib/db"
import { errorResponse, unauthorizedResponse, notFoundResponse, conflictResponse, serverErrorResponse } from "@/lib/api-utils"

export async function PATCH(request: Request) {
  const session = await auth()
  if (!session?.user?.id) return unauthorizedResponse()

  const body = await request.json()
  const { card_id } = body as { card_id?: string }

  if (!card_id) return errorResponse("card_id is required", 400)

  const card = await prisma.card.findFirst({
    where: { id: card_id, userId: session.user.id },
  })
  if (!card) return notFoundResponse("Card not found")

  try {
    const updated = await prisma.user.update({
      where: { id: session.user.id },
      data: { currentCard: card_id },
      include: {
        cards: {
          include: {
            links: true,
            collections: { include: { links: true } },
          },
        },
      },
    })

    return NextResponse.json({
      id: updated.id,
      username: updated.username,
      email: updated.email,
      fullname: updated.fullname,
      bio: updated.bio,
      avatar_url: updated.avatarUrl,
      theme: updated.theme,
      current_card: updated.currentCard,
      cards: updated.cards.map((c) => ({
        id: c.id,
        user_id: c.userId,
        name: c.name,
        bio: c.bio,
        style: c.style,
        links: c.links.map((l) => ({
          id: l.id, card_id: l.cardId, collection_id: l.collectionId,
          title: l.title, url: l.url, position: l.position,
        })),
        collections: c.collections.map((col) => ({
          id: col.id, card_id: col.cardId, title: col.title, position: col.position,
          links: col.links.map((l) => ({
            id: l.id, card_id: l.cardId, collection_id: l.collectionId,
            title: l.title, url: l.url, position: l.position,
          })),
        })),
        items_list: [],
      })),
    })
  } catch (error) {
    console.error("Set current card error:", error)
    return serverErrorResponse("Failed to set current card")
  }
}
