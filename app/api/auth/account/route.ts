import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { requireAuth } from "@/lib/auth-helpers"
import { accountDeleteSchema } from "@/lib/validations/auth"
import { errorResponse, unauthorizedResponse, notFoundResponse, readJsonBody, serverErrorResponse } from "@/lib/api-utils"
import { rateLimit } from "@/lib/rate-limit"
import { deleteFromR2 } from "@/lib/s3"
import { UnauthorizedError } from "@/lib/api-utils"
import argon2 from "argon2"

export async function DELETE(request: Request) {
  try {
    const user = await requireAuth()

    const body = await readJsonBody(request)
    if (body === null) return errorResponse("Invalid JSON body", 400)
    const parsed = accountDeleteSchema.safeParse(body)
    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0].message, 400)
    }

    // Per-user throttle against deletion attempts.
    if (!rateLimit(`account:${user.id}`, 10, 60_000)) {
      return errorResponse("Too many attempts. Please try again later.", 429)
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { username: true, email: true, password: true, avatarUrl: true },
    })
    if (!dbUser) return notFoundResponse("User not found")

    // Confirmation gate: password accounts verify their password; password-less
    // (OAuth-only) accounts must type "DELETE", their email, or their username as
    // the anti-CSRF signal, since they have no password to check.
    if (dbUser.password) {
      const valid = await argon2.verify(dbUser.password, parsed.data.password ?? "")
      if (!valid) return errorResponse("Current password is incorrect", 400)
    } else {
      const confirm = (parsed.data.confirm ?? "").trim().toLowerCase()
      const matches =
        confirm === "delete" ||
        confirm === dbUser.email.toLowerCase() ||
        confirm === dbUser.username.toLowerCase()
      if (!matches) {
        return errorResponse("Confirmation does not match your account", 400)
      }
    }

    await prisma.user.delete({ where: { id: user.id } })

    // Best-effort cleanup of the stored avatar, only after the delete succeeded.
    if (dbUser.avatarUrl) {
      await deleteFromR2(dbUser.avatarUrl)
    }

    return new NextResponse(null, { status: 204 })
  } catch (e) {
    if (e instanceof UnauthorizedError) return unauthorizedResponse()
    console.error("Delete account error:", e)
    return serverErrorResponse("Could not delete account")
  }
}