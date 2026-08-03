import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { requireAuth } from "@/lib/auth-helpers"
import { buildCardItemsList } from "@/lib/card-utils"
import { cardUpdateSchema } from "@/lib/validations/cards"
import { errorResponse, unauthorizedResponse, notFoundResponse, readJsonBody, serverErrorResponse } from "@/lib/api-utils"
import { UnauthorizedError } from "@/lib/api-utils"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ cardId: string }> }
) {
  try {
    const { cardId } = await params

    const card = await prisma.card.findUnique({
      where: { id: cardId },
      include: { user: { select: { id: true, username: true, fullname: true, bio: true, avatarUrl: true } } },
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
      user: card.user
        ? {
            id: card.user.id,
            username: card.user.username,
            fullname: card.user.fullname,
            bio: card.user.bio,
            avatar_url: card.user.avatarUrl,
          }
        : null,
    })
  } catch (e) {
    console.error("Get card error:", e)
    return serverErrorResponse("Could not load card")
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ cardId: string }> }
) {
  try {
    const user = await requireAuth()

    const { cardId } = await params
    const body = await readJsonBody(request)
    if (body === null) return errorResponse("Invalid JSON body", 400)
    const parsed = cardUpdateSchema.safeParse(body)
    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0].message, 400)
    }

    const card = await prisma.card.findFirst({
      where: { id: cardId, userId: user.id },
    })
    if (!card) return notFoundResponse("Card not found")

    if (parsed.data.name !== undefined) {
      const name = parsed.data.name.trim()
      if (!name) return errorResponse("Card name cannot be empty", 422)
    }

    const updated = await prisma.card.update({
      where: { id: cardId },
      data: parsed.data.name !== undefined ? { name: parsed.data.name.trim() } : {},
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
    if (e instanceof UnauthorizedError) return unauthorizedResponse()
    console.error("Update card error:", e)
    return serverErrorResponse("Could not update card")
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ cardId: string }> }
) {
  try {
    const user = await requireAuth()

    const { cardId } = await params

    const card = await prisma.card.findFirst({
      where: { id: cardId, userId: user.id },
    })
    if (!card) return notFoundResponse("Card not found")

    await prisma.card.delete({ where: { id: cardId } })

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { currentCard: true, lastSelectedCard: true },
    })

    if (dbUser?.currentCard === cardId) {
      const nextCard = await prisma.card.findFirst({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
      })
      await prisma.user.update({
        where: { id: user.id },
        data: { currentCard: nextCard?.id ?? null },
      })
    }

    if (dbUser?.lastSelectedCard === cardId) {
      await prisma.user.update({
        where: { id: user.id },
        data: { lastSelectedCard: null },
      })
    }

    return new NextResponse(null, { status: 204 })
  } catch (e) {
    if (e instanceof UnauthorizedError) return unauthorizedResponse()
    console.error("Delete card error:", e)
    return serverErrorResponse("Could not delete card")
  }
}