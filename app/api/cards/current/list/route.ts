import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { requireAuth } from "@/lib/auth-helpers"
import { buildCardItemsList } from "@/lib/card-utils"
import { unauthorizedResponse, notFoundResponse } from "@/lib/api-utils"

export async function GET() {
  try {
    const user = await requireAuth()

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { currentCard: true },
    })

    if (!dbUser?.currentCard) return notFoundResponse("No current card set")

    const card = await prisma.card.findUnique({
      where: { id: dbUser.currentCard },
    })

    if (!card) return notFoundResponse("Card not found")

    const itemsList = await buildCardItemsList(card.id)

    return NextResponse.json({
      id: card.id,
      user_id: card.userId,
      name: card.name,
      bio: card.bio,
      items_list: itemsList,
      style: card.style,
      user: {
        id: user.id,
        username: user.username,
      },
    })
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") return unauthorizedResponse()
    throw e
  }
}
