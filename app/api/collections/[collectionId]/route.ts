import { NextResponse } from "next/server"
import { auth } from "@/lib/auth-config"
import { prisma } from "@/lib/db"
import { collectionUpdateSchema } from "@/lib/validations/collections"
import { errorResponse, unauthorizedResponse, notFoundResponse, conflictResponse } from "@/lib/api-utils"

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ collectionId: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) return unauthorizedResponse()

  const { collectionId } = await params
  const body = await request.json()
  const parsed = collectionUpdateSchema.safeParse(body)
  if (!parsed.success) {
    return errorResponse(parsed.error.issues[0].message, 400)
  }

  const collection = await prisma.collection.findFirst({
    where: { id: collectionId, card: { userId: session.user.id } },
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
    if (error && typeof error === "object" && "code" in error && error.code === "P2002") {
      return conflictResponse("Collection title already exists for this card")
    }
    throw error
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ collectionId: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) return unauthorizedResponse()

  const { collectionId } = await params

  const collection = await prisma.collection.findFirst({
    where: { id: collectionId, card: { userId: session.user.id } },
  })
  if (!collection) return notFoundResponse("Collection not found")

  await prisma.collection.delete({ where: { id: collectionId } })

  return new NextResponse(null, { status: 204 })
}
