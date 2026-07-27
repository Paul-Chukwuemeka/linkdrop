import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { requireAuth } from "@/lib/auth-helpers"
import { unauthorizedResponse } from "@/lib/api-utils"

export async function GET() {
  try {
    const user = await requireAuth()

    const cards = await prisma.card.findMany({
      where: { userId: user.id },
      orderBy: { id: "asc" },
      select: {
        id: true,
        userId: true,
        name: true,
        bio: true,
        style: true,
      },
    })

    return NextResponse.json(
      cards.map((card) => ({
        id: card.id,
        user_id: card.userId,
        name: card.name,
        bio: card.bio,
        style: card.style,
        items_list: [],
      }))
    )
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") return unauthorizedResponse()
    throw e
  }
}
