import { NextResponse } from "next/server"
import { auth } from "@/lib/auth-config"
import { prisma } from "@/lib/db"
import { r2, R2_BUCKET, R2_PUBLIC_URL, deleteFromR2 } from "@/lib/s3"
import { PutObjectCommand } from "@aws-sdk/client-s3"
import { unauthorizedResponse, errorResponse, serverErrorResponse } from "@/lib/api-utils"
import { createHash } from "crypto"
import { toProfileResponse } from "@/lib/profile"

const MAX_SIZE = 5 * 1024 * 1024 // 5MB

const EXT_MAP: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/gif": "gif",
  "image/webp": "webp",
}

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) return unauthorizedResponse()

    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) return errorResponse("No file provided", 400)
    const contentType = file.type.split(";")[0].trim()
    if (!EXT_MAP[contentType]) return errorResponse("File must be a JPG, PNG, GIF, or WebP image", 400)
    if (file.size > MAX_SIZE) return errorResponse("File too large (max 5MB)", 413)

    const buffer = Buffer.from(await file.arrayBuffer())

    const hash = createHash("sha256").update(buffer).digest("hex")
    const ext = EXT_MAP[contentType]
    const key = `avatars/${hash}.${ext}`

    const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { avatarUrl: true } })

    await r2.send(
      new PutObjectCommand({
        Bucket: R2_BUCKET,
        Key: key,
        Body: buffer,
        ContentType: contentType,
      })
    )

    const avatarUrl = R2_PUBLIC_URL
      ? `${R2_PUBLIC_URL}/${key}`
      : `/${key}`

    const updated = await prisma.user.update({
      where: { id: session.user.id },
      data: { avatarUrl },
    })

    // Best-effort cleanup of the previous avatar, only after the new one is
    // safely in place (and never if it's the same content-hash key — another
    // user may reference it).
    if (user?.avatarUrl && user.avatarUrl !== avatarUrl) {
      await deleteFromR2(user.avatarUrl)
    }

    return NextResponse.json(toProfileResponse(updated))
  } catch (error) {
    console.error("Avatar upload error:", error)
    return serverErrorResponse("Failed to upload avatar")
  }
}
