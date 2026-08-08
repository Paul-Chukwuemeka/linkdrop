import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { requireAuth } from "@/lib/auth-helpers"
import { unauthorizedResponse, notFoundResponse, serverErrorResponse } from "@/lib/api-utils"
import { UnauthorizedError } from "@/lib/api-utils"

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
        password: true,
      },
    })

    if (!dbUser) return notFoundResponse("User not found")

    const account = await prisma.account.findFirst({
      where: { userId: dbUser.id },
      select: { provider: true },
    })

    return NextResponse.json(
      {
        id: dbUser.id,
        username: dbUser.username,
        email: dbUser.email,
        fullname: dbUser.fullname,
        has_password: dbUser.password !== null,
        provider: account?.provider ?? null,
      },
      { headers: { "Cache-Control": "no-store" } },
    )
  } catch (e) {
    if (e instanceof UnauthorizedError) return unauthorizedResponse()
    console.error("Auth me error:", e)
    return serverErrorResponse("Failed to load user")
  }
}
