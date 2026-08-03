import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { requireAuth } from "@/lib/auth-helpers"
import { buildCardItemsList } from "@/lib/card-utils"
import { unauthorizedResponse, notFoundResponse, serverErrorResponse } from "@/lib/api-utils"
import { UnauthorizedError } from "@/lib/api-utils"

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
      slug: card.slug,
      is_public: card.isPublic,
      items_list: itemsList,
      style: card.style,
      user: {
        id: user.id,
        username: user.username,
      },
    })
  } catch (e) {
    if (e instanceof UnauthorizedError) return unauthorizedResponse()
    console.error("Get current card list error:", e)
    return serverErrorResponse("Failed to load card list")
  }
}
