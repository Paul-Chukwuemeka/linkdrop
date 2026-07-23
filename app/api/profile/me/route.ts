import { NextResponse } from "next/server"
import { auth } from "@/lib/auth-config"
import { prisma } from "@/lib/db"
import { profileUpdateSchema } from "@/lib/validations/profile"
import { errorResponse, unauthorizedResponse, notFoundResponse, conflictResponse, serverErrorResponse } from "@/lib/api-utils"

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
      updateData.avatarUrl = avatar_url?.trim() || null
    }
    if (theme !== undefined) {
      updateData.theme = theme?.trim() || "default"
    }

    const updated = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
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
      cards: updated.cards.map((card) => ({
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
  } catch (error: unknown) {
    if (error && typeof error === "object" && "code" in error && error.code === "P2002") {
      return conflictResponse("Username already in use")
    }
    console.error("Profile update error:", error)
    return serverErrorResponse("Failed to update profile")
  }
}
