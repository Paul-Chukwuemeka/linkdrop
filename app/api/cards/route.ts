import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { requireAuth } from "@/lib/auth-helpers"
import { cardCreateSchema } from "@/lib/validations/cards"
import { unauthorizedResponse, errorResponse, serverErrorResponse } from "@/lib/api-utils"

export async function GET() {
  try {
    const user = await requireAuth()

    const cards = await prisma.card.findMany({
      where: { userId: user.id },
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
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") return unauthorizedResponse()
    throw e
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAuth()

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

    const card = await prisma.card.create({
      data: {
        userId: user.id,
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
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") return unauthorizedResponse()
    console.error("Create card error:", e)
    return serverErrorResponse("Could not create card")
  }
}
