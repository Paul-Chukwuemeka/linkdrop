import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { signupSchema } from "@/lib/validations/auth"
import { errorResponse, conflictResponse, serverErrorResponse } from "@/lib/api-utils"
import argon2 from "argon2"
import { DEFAULT_CARD_STYLE } from "@/lib/constants"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = signupSchema.safeParse(body)

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]
      return errorResponse(firstError.message, 400)
    }

    const { username, email, fullname, password } = parsed.data

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username: { equals: username, mode: "insensitive" } },
          { email: { equals: email, mode: "insensitive" } },
        ],
      },
    })

    if (existingUser) {
      const field = existingUser.username.toLowerCase() === username.toLowerCase()
        ? "Username"
        : "Email"
      return conflictResponse(`${field} already in use`)
    }

    const hashedPassword = await argon2.hash(password)

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          username,
          email,
          fullname,
          password: hashedPassword,
        },
      })

      const card = await tx.card.create({
        data: {
          userId: user.id,
          name: "Untitled",
          style: DEFAULT_CARD_STYLE,
        },
      })

      await tx.user.update({
        where: { id: user.id },
        data: { currentCard: card.id },
      })

      return { user }
    })

    return NextResponse.json(
      {
        user: {
          id: result.user.id,
          username: result.user.username,
          email: result.user.email,
          fullname: result.user.fullname,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Signup error:", error)
    return serverErrorResponse("Failed to create account")
  }
}
