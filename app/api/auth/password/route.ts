import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { requireAuth } from "@/lib/auth-helpers"
import { passwordChangeSchema } from "@/lib/validations/auth"
import { errorResponse, unauthorizedResponse, notFoundResponse, readJsonBody, serverErrorResponse } from "@/lib/api-utils"
import { rateLimit } from "@/lib/rate-limit"
import { UnauthorizedError } from "@/lib/api-utils"
import argon2 from "argon2"

export async function PATCH(request: Request) {
  try {
    const user = await requireAuth()

    const body = await readJsonBody(request)
    if (body === null) return errorResponse("Invalid JSON body", 400)
    const parsed = passwordChangeSchema.safeParse(body)
    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0].message, 400)
    }

    // Per-user throttle against password-stuffing against the API directly.
    if (!rateLimit(`password:${user.id}`, 10, 60_000)) {
      return errorResponse("Too many attempts. Please try again later.", 429)
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { password: true },
    })
    if (!dbUser) return notFoundResponse("User not found")
    if (!dbUser.password) {
      return errorResponse("This account uses a sign-in provider and has no password to change", 400)
    }

    const valid = await argon2.verify(dbUser.password, parsed.data.current_password)
    if (!valid) return errorResponse("Current password is incorrect", 400)

    const hashed = await argon2.hash(parsed.data.new_password)
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashed },
    })

    return new NextResponse(null, { status: 204 })
  } catch (e) {
    if (e instanceof UnauthorizedError) return unauthorizedResponse()
    console.error("Change password error:", e)
    return serverErrorResponse("Could not change password")
  }
}