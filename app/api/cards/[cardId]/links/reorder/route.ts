import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { requireAuth } from "@/lib/auth-helpers"
import { collectionLinksReorderSchema } from "@/lib/validations/links"
import { errorResponse, unauthorizedResponse, notFoundResponse, readJsonBody, serverErrorResponse } from "@/lib/api-utils"
import { UnauthorizedError } from "@/lib/api-utils"

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ cardId: string }> }
) {
  try {
    const user = await requireAuth()

    const { cardId } = await params
    const body = await readJsonBody(request)
    if (body === null) return errorResponse("Invalid JSON body", 400)
    const parsed = collectionLinksReorderSchema.safeParse(body)
    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0].message, 400)
    }

    const { collection_id, items } = parsed.data

    const card = await prisma.card.findFirst({
      where: { id: cardId, userId: user.id },
    })
    if (!card) return notFoundResponse("Card not found")

    if (collection_id) {
      const collection = await prisma.collection.findFirst({
        where: { id: collection_id, cardId },
      })
      if (!collection) return notFoundResponse("Collection not found")
    }

    const totalLinks = await prisma.link.count({
      where: { cardId, collectionId: collection_id ?? null },
    })
    if (totalLinks === 0) return new NextResponse(null, { status: 204 })
    if (items.length !== totalLinks) {
      return errorResponse("Reorder payload must include all links in this scope", 422)
    }

    const ids = items.map((i) => i.id)
    if (new Set(ids).size !== ids.length) {
      return errorResponse("Duplicate link in reorder payload", 422)
    }
    if (new Set(items.map((i) => i.position)).size !== items.length) {
      return errorResponse("Duplicate positions in reorder payload", 422)
    }

    const links = await prisma.link.findMany({
      where: { id: { in: ids }, cardId, collectionId: collection_id ?? null },
    })
    if (links.length !== ids.length) return notFoundResponse("Link not found")

    const positionMap = new Map(items.map((i) => [i.id, i.position]))

    await prisma.$transaction(async (tx) => {
      for (const linkId of ids) {
        await tx.link.update({
          where: { id: linkId },
          data: { position: positionMap.get(linkId)! },
        })
      }
    })

    return new NextResponse(null, { status: 204 })
  } catch (e) {
    if (e instanceof UnauthorizedError) return unauthorizedResponse()
    console.error("Reorder collection links error:", e)
    return serverErrorResponse("Could not reorder collection links")
  }
}
