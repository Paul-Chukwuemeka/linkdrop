import { NextResponse } from "next/server"
import { auth } from "@/lib/auth-config"
import { prisma } from "@/lib/db"
import { collectionCreateSchema } from "@/lib/validations/collections"
import { errorResponse, unauthorizedResponse, notFoundResponse, conflictResponse, serverErrorResponse } from "@/lib/api-utils"

export async function GET(request: Request) {
  const session = await auth()
  if (!session?.user?.id) return unauthorizedResponse()

  const { searchParams } = new URL(request.url)
  const cardId = searchParams.get("card_id")

  if (!cardId) return errorResponse("card_id is required", 400)

  const card = await prisma.card.findFirst({
    where: { id: cardId, userId: session.user.id },
  })
  if (!card) return notFoundResponse("Card not found")

  const collections = await prisma.collection.findMany({
    where: { cardId },
    include: { links: { orderBy: [{ position: "asc" }, { id: "asc" }] } },
    orderBy: [{ position: "asc" }, { id: "asc" }],
  })

  return NextResponse.json(
    collections.map((c) => ({
      id: c.id,
      card_id: c.cardId,
      title: c.title,
      position: c.position,
      links: c.links.map((l) => ({
        id: l.id,
        card_id: l.cardId,
        collection_id: l.collectionId,
        title: l.title,
        url: l.url,
        position: l.position,
      })),
    }))
  )
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id) return unauthorizedResponse()

  const body = await request.json()
  const parsed = collectionCreateSchema.safeParse(body)
  if (!parsed.success) {
    return errorResponse(parsed.error.issues[0].message, 400)
  }

  const { title, card_id } = parsed.data

  const card = await prisma.card.findFirst({
    where: { id: card_id, userId: session.user.id },
  })
  if (!card) return notFoundResponse("Card not found")

  const trimmedTitle = title.trim()
  if (!trimmedTitle) return errorResponse("Title cannot be empty", 422)

  const [maxCollection, maxLink] = await Promise.all([
    prisma.collection.aggregate({
      where: { cardId: card_id },
      _max: { position: true },
    }),
    prisma.link.aggregate({
      where: { cardId: card_id, collectionId: null },
      _max: { position: true },
    }),
  ])

  const position = Math.max(
    maxCollection._max.position ?? -1,
    maxLink._max.position ?? -1
  ) + 1

  try {
    const collection = await prisma.collection.create({
      data: {
        title: trimmedTitle,
        cardId: card_id,
        position,
      },
    })

    return NextResponse.json(
      {
        id: collection.id,
        card_id: collection.cardId,
        title: collection.title,
        position: collection.position,
        links: [],
      },
      { status: 201 }
    )
  } catch (error: unknown) {
    if (error && typeof error === "object" && "code" in error && error.code === "P2002") {
      return conflictResponse("Collection title already exists for this card")
    }
    console.error("Create collection error:", error)
    return serverErrorResponse("Could not create collection")
  }
}
