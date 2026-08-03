import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { requireAuth } from "@/lib/auth-helpers"
import { errorResponse, unauthorizedResponse, notFoundResponse, serverErrorResponse, readJsonBody } from "@/lib/api-utils"
import { UnauthorizedError } from "@/lib/api-utils"

export async function PATCH(request: Request) {
  try {
    const user = await requireAuth()

    const body = await readJsonBody(request)
    if (body === null) return errorResponse("Invalid JSON body", 400)
    const { card_id } = body as { card_id?: string | null }

    if (card_id) {
      const card = await prisma.card.findFirst({
        where: { id: card_id, userId: user.id },
      })
      if (!card) return notFoundResponse("Card not found")
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { lastSelectedCard: card_id || null },
    })

    return NextResponse.json({
      last_selected_card: updated.lastSelectedCard,
    })
  } catch (e) {
    if (e instanceof UnauthorizedError) return unauthorizedResponse()
    console.error("Set last selected card error:", e)
    return serverErrorResponse("Failed to update last selected card")
  }
}
