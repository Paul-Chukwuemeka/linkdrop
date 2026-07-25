import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { requireAuth } from "@/lib/auth-helpers"
import { cardStyleUpdateSchema } from "@/lib/validations/cards"
import { unauthorizedResponse, notFoundResponse, errorResponse } from "@/lib/api-utils"

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ cardId: string }> }
) {
  try {
    const user = await requireAuth()

    const { cardId } = await params
    const body = await request.json()
    const parsed = cardStyleUpdateSchema.safeParse(body)
    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0].message, 400)
    }

    const card = await prisma.card.findFirst({
      where: { id: cardId, userId: user.id },
    })
    if (!card) return notFoundResponse("Card not found")

    const updated = await prisma.card.update({
      where: { id: cardId },
      data: { style: parsed.data.style as never },
    })

    return NextResponse.json({
      id: updated.id,
      user_id: updated.userId,
      name: updated.name,
      bio: updated.bio,
      style: updated.style,
      links: [],
      collections: [],
    })
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") return unauthorizedResponse()
    throw e
  }
}
