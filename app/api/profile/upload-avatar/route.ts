import { NextResponse } from "next/server"
import { auth } from "@/lib/auth-config"
import { prisma } from "@/lib/db"
import { r2, R2_BUCKET, R2_PUBLIC_URL } from "@/lib/s3"
import { PutObjectCommand } from "@aws-sdk/client-s3"
import { unauthorizedResponse, errorResponse, serverErrorResponse } from "@/lib/api-utils"
import { randomUUID } from "crypto"

const MAX_SIZE = 5 * 1024 * 1024 // 5MB

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id) return unauthorizedResponse()

  const formData = await request.formData()
  const file = formData.get("file") as File | null

  if (!file) return errorResponse("No file provided", 400)
  if (!file.type.startsWith("image/")) return errorResponse("File must be an image", 400)
  if (file.size > MAX_SIZE) return errorResponse("File too large (max 5MB)", 413)

  const ext = file.name.split(".").pop() || "bin"
  const filename = `avatars/${randomUUID()}.${ext}`

  try {
    const buffer = Buffer.from(await file.arrayBuffer())

    await r2.send(
      new PutObjectCommand({
        Bucket: R2_BUCKET,
        Key: filename,
        Body: buffer,
        ContentType: file.type,
      })
    )

    const avatarUrl = R2_PUBLIC_URL
      ? `${R2_PUBLIC_URL}/${filename}`
      : `/${filename}`

    const updated = await prisma.user.update({
      where: { id: session.user.id },
      data: { avatarUrl },
      include: {
        cards: {
          include: {
            links: true,
            collections: { include: { links: true } },
          },
        },
      },
    })

    return NextResponse.json({
      id: updated.id,
      username: updated.username,
      email: updated.email,
      fullname: updated.fullname,
      bio: updated.bio,
      avatar_url: updated.avatarUrl,
      theme: updated.theme,
      current_card: updated.currentCard,
      cards: updated.cards.map((c) => ({
        id: c.id, user_id: c.userId, name: c.name, bio: c.bio, style: c.style,
        links: c.links.map((l) => ({
          id: l.id, card_id: l.cardId, collection_id: l.collectionId,
          title: l.title, url: l.url, position: l.position,
        })),
        collections: c.collections.map((col) => ({
          id: col.id, card_id: col.cardId, title: col.title, position: col.position,
          links: col.links.map((l) => ({
            id: l.id, card_id: l.cardId, collection_id: l.collectionId,
            title: l.title, url: l.url, position: l.position,
          })),
        })),
        items_list: [],
      })),
    })
  } catch (error) {
    console.error("Avatar upload error:", error)
    return serverErrorResponse("Failed to upload avatar")
  }
}
