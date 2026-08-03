import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { requireAuth } from "@/lib/auth-helpers"
import { cardCreateSchema } from "@/lib/validations/cards"
import { unauthorizedResponse, errorResponse, serverErrorResponse } from "@/lib/api-utils"
import { DEFAULT_CARD_STYLE } from "@/lib/constants"
import { UnauthorizedError } from "@/lib/api-utils"

export async function POST(request: Request) {
  try {
    const user = await requireAuth()

    let body: unknown = null
    try {
      body = await request.json()
    } catch {
      body = null
    }

    const parsed = cardCreateSchema.safeParse(body)
    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0].message, 400)
    }

    const name = parsed.data.name?.trim() || "Untitled"

    const card = await prisma.card.create({
      data: {
        userId: user.id,
        name,
        style: DEFAULT_CARD_STYLE,
      },
    })

    return NextResponse.json(
      {
        id: card.id,
        user_id: card.userId,
        name: card.name,
        bio: card.bio,
        style: card.style,
        links: [],
        collections: [],
      },
      { status: 201 }
    )
  } catch (e) {
    if (e instanceof UnauthorizedError) return unauthorizedResponse()
    console.error("Create card error:", e)
    return serverErrorResponse("Could not create card")
  }
}
