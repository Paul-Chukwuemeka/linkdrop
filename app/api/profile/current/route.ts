import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { requireAuth } from "@/lib/auth-helpers"
import { errorResponse, unauthorizedResponse, notFoundResponse, serverErrorResponse, readJsonBody } from "@/lib/api-utils"
import { UnauthorizedError } from "@/lib/api-utils"
import { toProfileResponse } from "@/lib/profile"

export async function PATCH(request: Request) {
  try {
    const user = await requireAuth()

    const body = await readJsonBody(request)
    if (body === null) return errorResponse("Invalid JSON body", 400)
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

    return NextResponse.json(toProfileResponse(updated))
  } catch (e) {
    if (e instanceof UnauthorizedError) return unauthorizedResponse()
    console.error("Set current card error:", e)
    return serverErrorResponse("Failed to set current card")
  }
}
