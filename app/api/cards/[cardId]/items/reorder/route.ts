import { NextResponse } from "next/server"
import { auth } from "@/lib/auth-config"
import { prisma } from "@/lib/db"
import { cardItemReorderSchema } from "@/lib/validations/cards"
import { errorResponse, unauthorizedResponse, notFoundResponse } from "@/lib/api-utils"

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ cardId: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) return unauthorizedResponse()

  const { cardId } = await params
  const body = await request.json()
  const parsed = cardItemReorderSchema.safeParse(body)
  if (!parsed.success) {
    return errorResponse(parsed.error.issues[0].message, 400)
  }

  const card = await prisma.card.findFirst({
    where: { id: cardId, userId: session.user.id },
  })
  if (!card) return notFoundResponse("Card not found")

  const { items } = parsed.data

  const totalLinks = await prisma.link.count({
    where: { cardId, collectionId: null },
  })
  const totalCollections = await prisma.collection.count({ where: { cardId } })
  const totalItems = totalLinks + totalCollections

  if (totalItems === 0) return new NextResponse(null, { status: 204 })
  if (items.length !== totalItems) {
    return errorResponse("Reorder payload must include all card items", 422)
  }

  const linkIds = items.filter((i) => i.type === "link").map((i) => i.id)
  const collectionIds = items.filter((i) => i.type === "collection").map((i) => i.id)

  if (new Set(linkIds).size !== linkIds.length || new Set(collectionIds).size !== collectionIds.length) {
    return errorResponse("Duplicate item in reorder payload", 422)
  }

  if (new Set(items.map((i) => i.position)).size !== items.length) {
    return errorResponse("Duplicate positions in reorder payload", 422)
  }

  if (linkIds.length > 0) {
    const links = await prisma.link.findMany({
      where: { id: { in: linkIds }, cardId, collectionId: null },
    })
    if (links.length !== linkIds.length) return notFoundResponse("Link not found")
  }

  if (collectionIds.length > 0) {
    const collections = await prisma.collection.findMany({
      where: { id: { in: collectionIds }, cardId },
    })
    if (collections.length !== collectionIds.length) return notFoundResponse("Collection not found")
  }

  const positionMap = new Map(items.map((i) => [`${i.type}:${i.id}`, i.position]))

  await prisma.$transaction(async (tx) => {
    for (const linkId of linkIds) {
      await tx.link.update({
        where: { id: linkId },
        data: { position: positionMap.get(`link:${linkId}`)! },
      })
    }
    for (const collectionId of collectionIds) {
      await tx.collection.update({
        where: { id: collectionId },
        data: { position: positionMap.get(`collection:${collectionId}`)! },
      })
    }
  })

  return new NextResponse(null, { status: 204 })
}
