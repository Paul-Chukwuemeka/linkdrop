import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { requireAuth } from "@/lib/auth-helpers"
import { linkReorderSchema } from "@/lib/validations/links"
import { errorResponse, unauthorizedResponse, notFoundResponse } from "@/lib/api-utils"

export async function PATCH(request: Request) {
  try {
    const user = await requireAuth()

    const body = await request.json()
    const parsed = linkReorderSchema.safeParse(body)
    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0].message, 400)
    }

    const { card_id, collection_id, items } = parsed.data

    if (!collection_id) {
      return errorResponse("Use /cards/{card_id}/reorder to reorder top-level links and collections", 400)
    }

    const card = await prisma.card.findFirst({
      where: { id: card_id, userId: user.id },
    })
    if (!card) return notFoundResponse("Card not found")

    const collection = await prisma.collection.findFirst({
      where: { id: collection_id, cardId: card_id },
    })
    if (!collection) return notFoundResponse("Collection not found")

    if (items.length === 0) return new NextResponse(null, { status: 204 })

    const ids = items.map((i) => i.id)
    if (new Set(ids).size !== ids.length) {
      return errorResponse("Duplicate link ids in reorder payload", 422)
    }

    const links = await prisma.link.findMany({
      where: { id: { in: ids }, cardId: card_id, collectionId: collection_id },
    })
    if (links.length !== ids.length) return notFoundResponse("Link not found")

    const positionMap = new Map(items.map((i) => [i.id, i.position]))

    await prisma.$transaction(async (tx) => {
      for (const link of links) {
        await tx.link.update({
          where: { id: link.id },
          data: { position: positionMap.get(link.id)! },
        })
      }
    })

    return new NextResponse(null, { status: 204 })
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") return unauthorizedResponse()
    throw e
  }
}
