import { NextResponse } from "next/server"
import { auth } from "@/lib/auth-config"
import { prisma } from "@/lib/db"
import { cardCreateSchema } from "@/lib/validations/cards"
import { unauthorizedResponse, errorResponse, serverErrorResponse } from "@/lib/api-utils"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return unauthorizedResponse()

  const cards = await prisma.card.findMany({
    where: { userId: session.user.id },
    include: {
      links: true,
      collections: { include: { links: true } },
    },
    orderBy: { id: "asc" },
  })

  return NextResponse.json(
    cards.map((card) => ({
      id: card.id,
      user_id: card.userId,
      name: card.name,
      bio: card.bio,
      style: card.style,
      links: card.links.map((l) => ({
        id: l.id, card_id: l.cardId, collection_id: l.collectionId,
        title: l.title, url: l.url, position: l.position,
      })),
      collections: card.collections.map((c) => ({
        id: c.id, card_id: c.cardId, title: c.title, position: c.position,
        links: c.links.map((l) => ({
          id: l.id, card_id: l.cardId, collection_id: l.collectionId,
          title: l.title, url: l.url, position: l.position,
        })),
      })),
    }))
  )
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id) return unauthorizedResponse()

  let body: unknown = null
  try {
    body = await request.json()
  } catch {
    body = null
  }

  const parsed = cardCreateSchema.safeParse(body)
  if (!parsed.success) {
    return errorResponse(parsed.error.issues[0].message, 400)
  }

  const name = parsed.data.name?.trim() || "Untitled"

  try {
    const card = await prisma.card.create({
      data: {
        userId: session.user.id,
        name,
      },
    })

    return NextResponse.json(
      {
        id: card.id,
        user_id: card.userId,
        name: card.name,
        bio: card.bio,
        style: card.style,
        links: [],
        collections: [],
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Create card error:", error)
    return serverErrorResponse("Could not create card")
  }
}
