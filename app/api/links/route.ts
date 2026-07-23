import { NextResponse } from "next/server"
import { auth } from "@/lib/auth-config"
import { prisma } from "@/lib/db"
import { linkCreateSchema } from "@/lib/validations/links"
import { errorResponse, unauthorizedResponse, notFoundResponse, serverErrorResponse } from "@/lib/api-utils"

export async function GET(request: Request) {
  const session = await auth()
  if (!session?.user?.id) return unauthorizedResponse()

  const { searchParams } = new URL(request.url)
  const cardId = searchParams.get("card_id")
  const collectionId = searchParams.get("collection_id")

  if (!cardId) return errorResponse("card_id is required", 400)

  const card = await prisma.card.findFirst({
    where: { id: cardId, userId: session.user.id },
  })
  if (!card) return notFoundResponse("Card not found")

  const where: Record<string, unknown> = { cardId }
  if (collectionId) {
    const collection = await prisma.collection.findFirst({
      where: { id: collectionId, cardId },
    })
    if (!collection) return notFoundResponse("Collection not found")
    where.collectionId = collectionId
  }

  const links = await prisma.link.findMany({
    where,
    orderBy: [{ position: "asc" }, { id: "asc" }],
  })

  return NextResponse.json(
    links.map((l) => ({
      id: l.id,
      card_id: l.cardId,
      collection_id: l.collectionId,
      title: l.title,
      url: l.url,
      position: l.position,
    }))
  )
}

async function getMaxPosition(cardId: string, collectionId: string | null) {
  if (collectionId) {
    const result = await prisma.link.aggregate({
      where: { cardId, collectionId },
      _max: { position: true },
    })
    return (result._max.position ?? -1) + 1
  }

  const [maxLink, maxCollection] = await Promise.all([
    prisma.link.aggregate({
      where: { cardId, collectionId: null },
      _max: { position: true },
    }),
    prisma.collection.aggregate({
      where: { cardId },
      _max: { position: true },
    }),
  ])

  const maxPos = Math.max(
    maxLink._max.position ?? -1,
    maxCollection._max.position ?? -1
  )
  return maxPos + 1
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id) return unauthorizedResponse()

  const body = await request.json()
  const parsed = linkCreateSchema.safeParse(body)
  if (!parsed.success) {
    return errorResponse(parsed.error.issues[0].message, 400)
  }

  const { title, url, card_id, collection_id } = parsed.data

  const card = await prisma.card.findFirst({
    where: { id: card_id, userId: session.user.id },
  })
  if (!card) return notFoundResponse("Card not found")

  if (collection_id) {
    const collection = await prisma.collection.findFirst({
      where: { id: collection_id, cardId: card_id },
    })
    if (!collection) return notFoundResponse("Collection not found")
  }

  const position = await getMaxPosition(card_id, collection_id ?? null)

  const link = await prisma.link.create({
    data: {
      title: title.trim(),
      url: url.trim(),
      cardId: card_id,
      collectionId: collection_id ?? null,
      position,
    },
  })

  return NextResponse.json(
    {
      id: link.id,
      card_id: link.cardId,
      collection_id: link.collectionId,
      title: link.title,
      url: link.url,
      position: link.position,
    },
    { status: 201 }
  )
}
