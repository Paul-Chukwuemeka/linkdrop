import { NextResponse } from "next/server"
import { auth } from "@/lib/auth-config"
import { prisma } from "@/lib/db"
import { linkUpdateSchema } from "@/lib/validations/links"
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
  const parsed = linkUpdateSchema.safeParse(body)
  if (!parsed.success) {
    return errorResponse(parsed.error.issues[0].message, 400)
  }

  const link = await prisma.link.findFirst({
    where: { id: linkId, card: { userId: session.user.id } },
  })
  if (!link) return notFoundResponse("Link not found")

  const updateData: Record<string, unknown> = {}

  if (parsed.data.title !== undefined) {
    const title = parsed.data.title.trim()
    if (!title) return errorResponse("Title cannot be empty", 422)
    updateData.title = title
  }

  if (parsed.data.url !== undefined) {
    const url = parsed.data.url.trim()
    if (!url) return errorResponse("URL cannot be empty", 422)
    updateData.url = url
  }

  if ("collection_id" in parsed.data) {
    const newCollectionId = parsed.data.collection_id ?? null
    updateData.collectionId = newCollectionId
    updateData.position = await getMaxPosition(link.cardId, newCollectionId)
  }

  const updated = await prisma.link.update({
    where: { id: linkId },
    data: updateData,
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

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ linkId: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) return unauthorizedResponse()

  const { linkId } = await params

  const link = await prisma.link.findFirst({
    where: { id: linkId, card: { userId: session.user.id } },
  })
  if (!link) return notFoundResponse("Link not found")

  await prisma.link.delete({ where: { id: linkId } })

  return new NextResponse(null, { status: 204 })
}
