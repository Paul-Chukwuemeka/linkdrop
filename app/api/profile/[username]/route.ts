import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { buildCardItemsList } from "@/lib/card-utils"
import { notFoundResponse } from "@/lib/api-utils"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params

  const user = await prisma.user.findFirst({
    where: { username: { equals: username, mode: "insensitive" } },
  })

  if (!user) return notFoundResponse("User not found")

  if (!user.currentCard) {
    return NextResponse.json({
      id: null,
      user_id: user.id,
      name: "Untitled",
      items_list: [],
      style: {},
      user: {
        id: user.id,
        username: user.username,
        fullname: user.fullname,
        bio: user.bio,
        avatar_url: user.avatarUrl,
      },
    })
  }

  const card = await prisma.card.findUnique({
    where: { id: user.currentCard },
  })

  if (!card) return notFoundResponse("Card not found")

  const itemsList = await buildCardItemsList(card.id)

  return NextResponse.json(
    {
      id: card.id,
      user_id: card.userId,
      name: card.name,
      bio: card.bio,
      items_list: itemsList,
      style: card.style,
      user: {
        id: user.id,
        username: user.username,
        fullname: user.fullname,
        bio: user.bio,
        avatar_url: user.avatarUrl,
      },
    },
    { headers: { "Cache-Control": "public, max-age=60" } }
  )
}
