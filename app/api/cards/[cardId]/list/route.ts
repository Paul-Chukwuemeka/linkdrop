import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { requireAuth } from "@/lib/auth-helpers"
import { buildCardItemsList } from "@/lib/card-utils"
import { unauthorizedResponse, notFoundResponse, serverErrorResponse } from "@/lib/api-utils"
import { UnauthorizedError } from "@/lib/api-utils"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ cardId: string }> }
) {
  try {
    const user = await requireAuth()

    const { cardId } = await params

    const card = await prisma.card.findFirst({
      where: { id: cardId, userId: user.id },
    })
    if (!card) return notFoundResponse("Card not found")

    const itemsList = await buildCardItemsList(card.id)

    return NextResponse.json({
      id: card.id,
      user_id: card.userId,
      name: card.name,
      bio: card.bio,
      use_profile_bio: card.useProfileBio,
      slug: card.slug,
      is_public: card.isPublic,
      items_list: itemsList,
      style: card.style,
    })
  } catch (e) {
    if (e instanceof UnauthorizedError) return unauthorizedResponse()
    console.error("Get card list error:", e)
    return serverErrorResponse("Could not load card")
  }
}
