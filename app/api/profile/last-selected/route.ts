import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { requireAuth } from "@/lib/auth-helpers"
import { errorResponse, unauthorizedResponse, serverErrorResponse } from "@/lib/api-utils"

export async function PATCH(request: Request) {
  try {
    const user = await requireAuth()

    const body = await request.json()
    const { card_id } = body as { card_id?: string | null }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { lastSelectedCard: card_id || null },
    })

    return NextResponse.json({
      last_selected_card: updated.lastSelectedCard,
    })
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") return unauthorizedResponse()
    console.error("Set last selected card error:", e)
    return serverErrorResponse("Failed to update last selected card")
  }
}
