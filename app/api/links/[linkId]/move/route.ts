import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { requireAuth } from "@/lib/auth-helpers"
import { linkMoveSchema } from "@/lib/validations/links"
import { errorResponse, unauthorizedResponse, notFoundResponse } from "@/lib/api-utils"
import { getMaxPosition } from "@/lib/position-utils"

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ linkId: string }> }
) {
  try {
    const user = await requireAuth()

    const { linkId } = await params
    const body = await request.json()
    const parsed = linkMoveSchema.safeParse(body)
    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0].message, 400)
    }

    const link = await prisma.link.findFirst({
      where: { id: linkId, card: { userId: user.id } },
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
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") return unauthorizedResponse()
    throw e
  }
}
