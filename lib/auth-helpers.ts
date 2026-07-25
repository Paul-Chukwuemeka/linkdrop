import { auth } from "@/lib/auth-config"

export async function requireAuth() {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("UNAUTHORIZED")
  }
  return session.user as { id: string; username: string; email: string }
}

/**
 * Usage in route handlers:
 *
 *   import { requireAuth } from "@/lib/auth-helpers"
 *   import { unauthorizedResponse, serverErrorResponse } from "@/lib/api-utils"
 *
 *   export async function GET() {
 *     try {
 *       const user = await requireAuth()
 *       // ... handler logic using user.id, user.username
 *     } catch (e) {
 *       if (e instanceof Error && e.message === "UNAUTHORIZED") {
 *         return unauthorizedResponse()
 *       }
 *       console.error("Unexpected error:", e)
 *       return serverErrorResponse()
 *     }
 *   }
 */
