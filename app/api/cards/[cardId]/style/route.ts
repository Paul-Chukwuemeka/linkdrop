import { NextResponse } from "next/server"
import { auth } from "@/lib/auth-config"
import { prisma } from "@/lib/db"
import { unauthorizedResponse, notFoundResponse, errorResponse } from "@/lib/api-utils"

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ cardId: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) return unauthorizedResponse()

  const { cardId } = await params
  const body = await request.json()
  const { style } = body as { style?: Record<string, unknown> }

  if (!style || typeof style !== "object") {
    return errorResponse("style is required", 400)
  }

  const card = await prisma.card.findFirst({
    where: { id: cardId, userId: session.user.id },
  })
  if (!card) return notFoundResponse("Card not found")

  const updated = await prisma.card.update({
    where: { id: cardId },
    data: { style: style as never },
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
}
