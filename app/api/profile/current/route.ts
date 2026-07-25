import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { requireAuth } from "@/lib/auth-helpers"
import { errorResponse, unauthorizedResponse, notFoundResponse, serverErrorResponse } from "@/lib/api-utils"

export async function PATCH(request: Request) {
  try {
    const user = await requireAuth()

    const body = await request.json()
    const { card_id } = body as { card_id?: string }

    if (!card_id) return errorResponse("card_id is required", 400)

    const card = await prisma.card.findFirst({
      where: { id: card_id, userId: user.id },
    })
    if (!card) return notFoundResponse("Card not found")

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { currentCard: card_id },
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
    })
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") return unauthorizedResponse()
    console.error("Set current card error:", e)
    return serverErrorResponse("Failed to set current card")
  }
}
