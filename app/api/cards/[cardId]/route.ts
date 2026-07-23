import { NextResponse } from "next/server"
import { auth } from "@/lib/auth-config"
import { prisma } from "@/lib/db"
import { buildCardItemsList } from "@/lib/card-utils"
import { cardUpdateSchema, cardItemReorderSchema } from "@/lib/validations/cards"
import { errorResponse, unauthorizedResponse, notFoundResponse, serverErrorResponse } from "@/lib/api-utils"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ cardId: string }> }
) {
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
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ cardId: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) return unauthorizedResponse()

  const { cardId } = await params
  const body = await request.json()
  const parsed = cardUpdateSchema.safeParse(body)
  if (!parsed.success) {
    return errorResponse(parsed.error.issues[0].message, 400)
  }

  const card = await prisma.card.findFirst({
    where: { id: cardId, userId: session.user.id },
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
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ cardId: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) return unauthorizedResponse()

  const { cardId } = await params

  const card = await prisma.card.findFirst({
    where: { id: cardId, userId: session.user.id },
  })
  if (!card) return notFoundResponse("Card not found")

  await prisma.card.delete({ where: { id: cardId } })

  return new NextResponse(null, { status: 204 })
}
