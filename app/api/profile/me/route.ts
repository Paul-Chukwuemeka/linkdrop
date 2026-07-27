import { NextResponse } from "next/server"
import { auth } from "@/lib/auth-config"
import { prisma } from "@/lib/db"
import { profileUpdateSchema } from "@/lib/validations/profile"
import { errorResponse, unauthorizedResponse, notFoundResponse, conflictResponse, serverErrorResponse } from "@/lib/api-utils"
import { r2, R2_BUCKET, R2_PUBLIC_URL, deleteFromR2 } from "@/lib/s3"
import { PutObjectCommand } from "@aws-sdk/client-s3"
import { createHash } from "crypto"

const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5MB
const FETCH_TIMEOUT = 10000 // 10s

const CONTENT_TYPE_TO_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/gif": "gif",
  "image/webp": "webp",
}

const ALLOWED_AVATAR_HOSTS = new Set([
  "lh3.googleusercontent.com",
  "pbs.twimg.com",
  "avatars.githubusercontent.com",
  "i.pravatar.cc",
])

async function reHostAvatarUrl(url: string, currentAvatarUrl?: string | null): Promise<string> {
  const urlObj = new URL(url)
  if (!ALLOWED_AVATAR_HOSTS.has(urlObj.hostname)) {
    throw new Error("Image host not allowed")
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT)

  let response: Response
  try {
    response = await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": "LinkForge/1.0" },
    })
  } finally {
    clearTimeout(timeout)
  }

  if (!response.ok) throw new Error(`Failed to fetch image (HTTP ${response.status})`)

  const contentType = response.headers.get("content-type") || ""
  if (!contentType.startsWith("image/")) throw new Error("URL does not point to an image")

  const contentLength = Number(response.headers.get("content-length") || "0")
  if (contentLength > MAX_IMAGE_SIZE) throw new Error("Image exceeds 5MB limit")

  const buffer = Buffer.from(await response.arrayBuffer())
  if (buffer.length > MAX_IMAGE_SIZE) throw new Error("Image exceeds 5MB limit")

  const hash = createHash("sha256").update(buffer).digest("hex")
  const ext = CONTENT_TYPE_TO_EXT[contentType.split(";")[0].trim()] || "jpg"
  const key = `avatars/${hash}.${ext}`

  if (currentAvatarUrl) await deleteFromR2(currentAvatarUrl)

  await r2.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: contentType.split(";")[0].trim(),
    })
  )

  return R2_PUBLIC_URL ? `${R2_PUBLIC_URL}/${key}` : `/${key}`
}

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return unauthorizedResponse()

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      cards: {
        include: {
          links: true,
          collections: { include: { links: true } },
        },
      },
    },
  })

  if (!user) return notFoundResponse("User not found")

  return NextResponse.json({
    id: user.id,
    username: user.username,
    email: user.email,
    fullname: user.fullname,
    bio: user.bio,
    avatar_url: user.avatarUrl,
    theme: user.theme,
    current_card: user.currentCard,
    last_selected_card: user.lastSelectedCard,
    cards: user.cards.map((card) => ({
      id: card.id,
      user_id: card.userId,
      name: card.name,
      bio: card.bio,
      style: card.style,
      links: card.links.map((l) => ({
        id: l.id,
        card_id: l.cardId,
        collection_id: l.collectionId,
        title: l.title,
        url: l.url,
        position: l.position,
      })),
      collections: card.collections.map((c) => ({
        id: c.id,
        card_id: c.cardId,
        title: c.title,
        position: c.position,
        links: c.links.map((l) => ({
          id: l.id,
          card_id: l.cardId,
          collection_id: l.collectionId,
          title: l.title,
          url: l.url,
          position: l.position,
        })),
      })),
      items_list: [],
    })),
  })
}

export async function PATCH(request: Request) {
  const session = await auth()
  if (!session?.user?.id) return unauthorizedResponse()

  const body = await request.json()
  const parsed = profileUpdateSchema.safeParse(body)
  if (!parsed.success) {
    return errorResponse(parsed.error.issues[0].message, 400)
  }

  const { username, fullname, bio, avatar_url, theme } = parsed.data

  try {
    const updateData: Record<string, unknown> = {}

    if (username !== undefined) {
      const trimmed = username.trim()
      if (!trimmed) return errorResponse("Username cannot be empty", 422)
      updateData.username = trimmed
    }
    if (fullname !== undefined) {
      const trimmed = fullname.trim()
      if (!trimmed) return errorResponse("Full name cannot be empty", 422)
      updateData.fullname = trimmed
    }
    if (bio !== undefined) {
      updateData.bio = bio?.trim() || null
    }
    if (avatar_url !== undefined) {
      const trimmed = avatar_url?.trim() || null
      if (trimmed && /^https?:\/\//i.test(trimmed)) {
        try {
          const current = await prisma.user.findUnique({ where: { id: session.user.id }, select: { avatarUrl: true } })
          updateData.avatarUrl = await reHostAvatarUrl(trimmed, current?.avatarUrl)
        } catch (err) {
          const message = err instanceof Error ? err.message : "Failed to process image URL"
          return errorResponse(message, 400)
        }
      } else {
        updateData.avatarUrl = trimmed
      }
    }
    if (theme !== undefined) {
      updateData.theme = theme?.trim() || "default"
    }

    const updated = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
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
      last_selected_card: updated.lastSelectedCard,
    })
  } catch (error: unknown) {
    if (error && typeof error === "object" && "code" in error && error.code === "P2002") {
      return conflictResponse("Username already in use")
    }
    console.error("Profile update error:", error)
    return serverErrorResponse("Failed to update profile")
  }
}
