import { NextResponse } from "next/server"
import { auth } from "@/lib/auth-config"
import { prisma } from "@/lib/db"
import { profileUpdateSchema } from "@/lib/validations/profile"
import { errorResponse, unauthorizedResponse, notFoundResponse, conflictResponse, serverErrorResponse, readJsonBody, isP2002 } from "@/lib/api-utils"
import { deleteFromR2 } from "@/lib/s3"
import { reHostAvatarUrl } from "@/lib/rehost"
import { toProfileResponse } from "@/lib/profile"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) return unauthorizedResponse()

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    if (!user) return notFoundResponse("User not found")

    return NextResponse.json(toProfileResponse(user))
  } catch (error) {
    console.error("Profile get error:", error)
    return serverErrorResponse("Failed to load profile")
  }
}

export async function PATCH(request: Request) {
  const session = await auth()
  if (!session?.user?.id) return unauthorizedResponse()

  const body = await readJsonBody(request)
  if (body === null) return errorResponse("Invalid JSON body", 400)
  const parsed = profileUpdateSchema.safeParse(body)
  if (!parsed.success) {
    return errorResponse(parsed.error.issues[0].message, 400)
  }

  const { username, fullname, bio, avatar_url, theme } = parsed.data

  let previousAvatarUrl: string | null = null

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
      const current = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { avatarUrl: true },
      })
      previousAvatarUrl = current?.avatarUrl ?? null

      if (trimmed && /^https?:\/\//i.test(trimmed)) {
        try {
          updateData.avatarUrl = await reHostAvatarUrl(trimmed)
        } catch (err) {
          const message = err instanceof Error ? err.message : "Failed to process image URL"
          return errorResponse(message, 400)
        }
      } else {
        // Explicit clear (avatar_url: null/""): just drop the reference. The
        // stored object is freed once the DB write succeeds (see cleanup below),
        // so a failed update never leaves the profile pointing at a deleted file.
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

    // Best-effort cleanup of the previous avatar, only after the DB write
    // succeeded and only when the key actually changed (content-hash keys may
    // be shared between users).
    if (previousAvatarUrl && previousAvatarUrl !== updated.avatarUrl) {
      await deleteFromR2(previousAvatarUrl)
    }

    return NextResponse.json(toProfileResponse(updated))
  } catch (error: unknown) {
    if (isP2002(error)) {
      return conflictResponse("Username already in use")
    }
    console.error("Profile update error:", error)
    return serverErrorResponse("Failed to update profile")
  }
}
