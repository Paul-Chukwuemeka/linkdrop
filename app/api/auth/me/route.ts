import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { requireAuth } from "@/lib/auth-helpers"
import { unauthorizedResponse, notFoundResponse } from "@/lib/api-utils"

export async function GET() {
  try {
    const user = await requireAuth()

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        username: true,
        email: true,
        fullname: true,
      },
    })

    if (!dbUser) return notFoundResponse("User not found")

    return NextResponse.json(dbUser)
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") return unauthorizedResponse()
    throw e
  }
}
