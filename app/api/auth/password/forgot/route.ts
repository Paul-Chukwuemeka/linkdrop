import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { passwordForgotSchema } from "@/lib/validations/auth"
import { errorResponse, readJsonBody } from "@/lib/api-utils"
import { checkRateLimit } from "@/lib/rate-limit"
import { generateResetToken } from "@/lib/password-reset"
import { RESET_TOKEN_TTL_MS } from "@/lib/password-reset"
import { sendPasswordResetEmail } from "@/lib/email"

export async function POST(request: Request) {
  if (!checkRateLimit(request, 5, 60_000)) {
    return errorResponse("Too many requests. Please try again later.", 429)
  }

  const body = await readJsonBody(request)
  if (body === null) return errorResponse("Invalid JSON body", 400)
  const parsed = passwordForgotSchema.safeParse(body)
  if (!parsed.success) {
    return errorResponse(parsed.error.issues[0].message, 400)
  }

  try {
    const email = parsed.data.email.toLowerCase()
    const user = await prisma.user.findUnique({ where: { email } })

    if (user) {
      await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } })
      const { token, tokenHash } = generateResetToken()
      await prisma.passwordResetToken.create({
        data: {
          userId: user.id,
          tokenHash,
          expiresAt: new Date(Date.now() + RESET_TOKEN_TTL_MS),
        },
      })
      const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
      await sendPasswordResetEmail(user.email, `${base}/reset-password?token=${token}`)
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error("Forgot password error:", e)
    return NextResponse.json({ ok: true })
  }
}
