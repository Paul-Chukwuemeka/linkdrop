import { NextResponse } from "next/server"
import { auth } from "@/lib/auth-config"
import { prisma } from "@/lib/db"
import { linkMoveSchema } from "@/lib/validations/links"
import { errorResponse, unauthorizedResponse, notFoundResponse } from "@/lib/api-utils"

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
  return Math.max(maxLink._max.position ?? -1, maxCollection._max.position ?? -1) + 1
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ linkId: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) return unauthorizedResponse()

  const { linkId } = await params
  const body = await request.json()
  const parsed = linkMoveSchema.safeParse(body)
  if (!parsed.success) {
    return errorResponse(parsed.error.issues[0].message, 400)
  }

  const link = await prisma.link.findFirst({
    where: { id: linkId, card: { userId: session.user.id } },
  })
  if (!link) return notFoundResponse("Link not found")

  const newCollectionId = parsed.data.collection_id ?? null

  if (newCollectionId) {
    const collection = await prisma.collection.findFirst({
      where: { id: newCollectionId, cardId: link.cardId },
    })
    if (!collection) return notFoundResponse("Collection not found")
  }

  const position = await getMaxPosition(link.cardId, newCollectionId)

  const updated = await prisma.link.update({
    where: { id: linkId },
    data: {
      collectionId: newCollectionId,
      position,
    },
  })

  return NextResponse.json({
    id: updated.id,
    card_id: updated.cardId,
    collection_id: updated.collectionId,
    title: updated.title,
    url: updated.url,
    position: updated.position,
  })
}
