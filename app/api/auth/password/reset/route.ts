import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { passwordResetSchema } from "@/lib/validations/auth"
import { errorResponse, readJsonBody, serverErrorResponse } from "@/lib/api-utils"
import { checkRateLimit } from "@/lib/rate-limit"
import { hashResetToken } from "@/lib/password-reset"
import argon2 from "argon2"

export async function POST(request: Request) {
  if (!checkRateLimit(request, 10, 60_000)) {
    return errorResponse("Too many requests. Please try again later.", 429)
  }

  const body = await readJsonBody(request)
  if (body === null) return errorResponse("Invalid JSON body", 400)
  const parsed = passwordResetSchema.safeParse(body)
  if (!parsed.success) {
    return errorResponse(parsed.error.issues[0].message, 400)
  }

  try {
    const record = await prisma.passwordResetToken.findUnique({
      where: { tokenHash: hashResetToken(parsed.data.token) },
    })
    if (!record || record.usedAt || record.expiresAt < new Date()) {
      return errorResponse("This reset link is invalid or has expired", 400)
    }

    const hashed = await argon2.hash(parsed.data.new_password)
    const claimed = await prisma.$transaction(async (tx) => {
      const tokenUpdate = await tx.passwordResetToken.updateMany({
        where: {
          id: record.id,
          usedAt: null,
          expiresAt: { gt: new Date() },
        },
        data: { usedAt: new Date() },
      })
      if (tokenUpdate.count === 0) return false
      await tx.user.update({
        where: { id: record.userId },
        data: { password: hashed },
      })
      await tx.session.deleteMany({ where: { userId: record.userId } })
      return true
    })
    if (!claimed) {
      return errorResponse("This reset link is invalid or has expired", 400)
    }

    return new NextResponse(null, { status: 204 })
  } catch (e) {
    console.error("Reset password error:", e)
    return serverErrorResponse("Could not reset password")
  }
}
