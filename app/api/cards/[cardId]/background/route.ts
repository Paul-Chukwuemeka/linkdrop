import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { requireAuth } from "@/lib/auth-helpers"
import { r2, R2_BUCKET, R2_PUBLIC_URL, deleteFromR2 } from "@/lib/s3"
import { PutObjectCommand } from "@aws-sdk/client-s3"
import { unauthorizedResponse, notFoundResponse, errorResponse, serverErrorResponse } from "@/lib/api-utils"
import { UnauthorizedError } from "@/lib/api-utils"
import { createHash } from "crypto"

const MAX_SIZE = 5 * 1024 * 1024 // 5MB

const EXT_MAP: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/gif": "gif",
  "image/webp": "webp",
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ cardId: string }> }
) {
  try {
    const user = await requireAuth()

    const { cardId } = await params

    const card = await prisma.card.findFirst({
      where: { id: cardId, userId: user.id },
    })
    if (!card) return notFoundResponse("Card not found")

    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) return errorResponse("No file provided", 400)
    const contentType = file.type.split(";")[0].trim()
    if (!EXT_MAP[contentType]) return errorResponse("File must be a JPG, PNG, GIF, or WebP image", 400)
    if (file.size > MAX_SIZE) return errorResponse("File too large (max 5MB)", 413)

    const buffer = Buffer.from(await file.arrayBuffer())

    const hash = createHash("sha256").update(buffer).digest("hex")
    const ext = EXT_MAP[contentType]
    const key = `backgrounds/${hash}.${ext}`

    await r2.send(
      new PutObjectCommand({
        Bucket: R2_BUCKET,
        Key: key,
        Body: buffer,
        ContentType: contentType,
      })
    )

    const url = R2_PUBLIC_URL
      ? `${R2_PUBLIC_URL}/${key}`
      : `/${key}`

    // Best-effort cleanup of the previous background image, only after the new
    // one is safely in place (and never if it's the same content-hash key —
    // another card may reference it).
    const previous = (card.style as { profile_image?: string } | null)?.profile_image
    if (previous && previous !== url) {
      await deleteFromR2(previous)
    }

    return NextResponse.json({ url })
  } catch (e) {
    if (e instanceof UnauthorizedError) return unauthorizedResponse()
    console.error("Background upload error:", e)
    return serverErrorResponse("Failed to upload background image")
  }
}
