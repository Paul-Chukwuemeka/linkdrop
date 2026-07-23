import { NextResponse } from "next/server"
import { auth } from "@/lib/auth-config"
import { prisma } from "@/lib/db"
import { buildCardItemsList } from "@/lib/card-utils"
import { unauthorizedResponse, notFoundResponse } from "@/lib/api-utils"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return unauthorizedResponse()

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { currentCard: true },
  })

  if (!user?.currentCard) return notFoundResponse("No current card set")

  const card = await prisma.card.findUnique({
    where: { id: user.currentCard },
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
    user: {
      id: session.user.id,
      username: session.user.username,
    },
  })
}
