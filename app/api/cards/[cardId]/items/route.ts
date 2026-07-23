import { NextResponse } from "next/server"
import { auth } from "@/lib/auth-config"
import { prisma } from "@/lib/db"
import { buildCardItemsList } from "@/lib/card-utils"
import { unauthorizedResponse, notFoundResponse } from "@/lib/api-utils"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ cardId: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) return unauthorizedResponse()

  const { cardId } = await params

  const card = await prisma.card.findFirst({
    where: { id: cardId, userId: session.user.id },
  })
  if (!card) return notFoundResponse("Card not found")

  const itemsList = await buildCardItemsList(card.id)

  return NextResponse.json({
    id: card.id,
    user_id: card.userId,
    name: card.name,
    bio: card.bio,
    items_list: itemsList,
    style: card.style,
  })
}
