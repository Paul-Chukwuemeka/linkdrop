import { NextResponse } from "next/server"
import { auth } from "@/lib/auth-config"
import { prisma } from "@/lib/db"
import { r2, R2_BUCKET, R2_PUBLIC_URL, deleteFromR2 } from "@/lib/s3"
import { PutObjectCommand } from "@aws-sdk/client-s3"
import { unauthorizedResponse, errorResponse, serverErrorResponse } from "@/lib/api-utils"
import { createHash } from "crypto"

const MAX_SIZE = 5 * 1024 * 1024 // 5MB

const EXT_MAP: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/gif": "gif",
  "image/webp": "webp",
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id) return unauthorizedResponse()

  const formData = await request.formData()
  const file = formData.get("file") as File | null

  if (!file) return errorResponse("No file provided", 400)
  if (!file.type.startsWith("image/")) return errorResponse("File must be an image", 400)
  if (file.size > MAX_SIZE) return errorResponse("File too large (max 5MB)", 413)

  try {
    const buffer = Buffer.from(await file.arrayBuffer())

    const hash = createHash("sha256").update(buffer).digest("hex")
    const ext = EXT_MAP[file.type.split(";")[0].trim()] || file.name.split(".").pop() || "jpg"
    const key = `avatars/${hash}.${ext}`

    const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { avatarUrl: true } })
    if (user?.avatarUrl) await deleteFromR2(user.avatarUrl)

    await r2.send(
      new PutObjectCommand({
        Bucket: R2_BUCKET,
        Key: key,
        Body: buffer,
        ContentType: file.type.split(";")[0].trim(),
      })
    )

    const avatarUrl = R2_PUBLIC_URL
      ? `${R2_PUBLIC_URL}/${key}`
      : `/${key}`

    const updated = await prisma.user.update({
      where: { id: session.user.id },
      data: { avatarUrl },
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
    })
  } catch (error) {
    console.error("Avatar upload error:", error)
    return serverErrorResponse("Failed to upload avatar")
  }
}
