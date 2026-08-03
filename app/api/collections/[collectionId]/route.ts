import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { requireAuth } from "@/lib/auth-helpers"
import { collectionUpdateSchema } from "@/lib/validations/collections"
import { errorResponse, unauthorizedResponse, notFoundResponse, conflictResponse, readJsonBody, serverErrorResponse, isP2002 } from "@/lib/api-utils"
import { UnauthorizedError } from "@/lib/api-utils"

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ collectionId: string }> }
) {
  try {
    const user = await requireAuth()

    const { collectionId } = await params
    const body = await readJsonBody(request)
    if (body === null) return errorResponse("Invalid JSON body", 400)
    const parsed = collectionUpdateSchema.safeParse(body)
    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0].message, 400)
    }

    const collection = await prisma.collection.findFirst({
      where: { id: collectionId, card: { userId: user.id } },
    })
    if (!collection) return notFoundResponse("Collection not found")

    if (parsed.data.title !== undefined) {
      const title = parsed.data.title.trim()
      if (!title) return errorResponse("Title cannot be empty", 422)
    }

    try {
      const updated = await prisma.collection.update({
        where: { id: collectionId },
        data: parsed.data.title !== undefined ? { title: parsed.data.title.trim() } : {},
        include: { links: { orderBy: [{ position: "asc" }, { id: "asc" }] } },
      })

      return NextResponse.json({
        id: updated.id,
        card_id: updated.cardId,
        title: updated.title,
        position: updated.position,
        links: updated.links.map((l) => ({
          id: l.id,
          card_id: l.cardId,
          collection_id: l.collectionId,
          title: l.title,
          url: l.url,
          position: l.position,
        })),
      })
    } catch (error: unknown) {
      if (isP2002(error)) {
        return conflictResponse("Collection title already exists for this card")
      }
      console.error("Update collection error:", error)
      return serverErrorResponse("Could not update collection")
    }
  } catch (e) {
    if (e instanceof UnauthorizedError) return unauthorizedResponse()
    console.error("Update collection error:", e)
    return serverErrorResponse("Could not update collection")
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ collectionId: string }> }
) {
  try {
    const user = await requireAuth()

    const { collectionId } = await params

    const collection = await prisma.collection.findFirst({
      where: { id: collectionId, card: { userId: user.id } },
    })
    if (!collection) return notFoundResponse("Collection not found")

    await prisma.collection.delete({ where: { id: collectionId } })

    return new NextResponse(null, { status: 204 })
  } catch (e) {
    if (e instanceof UnauthorizedError) return unauthorizedResponse()
    console.error("Delete collection error:", e)
    return serverErrorResponse("Could not delete collection")
  }
}
