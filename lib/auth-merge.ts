import { prisma } from "@/lib/db"
import { isP2002 } from "@/lib/api-utils"

export type GoogleAccountPayload = {
  providerAccountId?: string | null
  access_token?: string | null
  id_token?: string | null
}

export type LinkGoogleUserArgs = {
  email: string
  name: string | null | undefined
  image?: string | null
  account?: GoogleAccountPayload
}

export type LinkedGoogleUser = {
  id: string
  username: string
  email: string
}

// Usernames are unique case-insensitively (see the LOWER(username) index that
// backs the migration). The free-name probe must therefore be case-insensitive
// too, or an exact-match miss can still blow up on create with a P2002.
async function uniqueUsername(baseUsername: string): Promise<string> {
  const taken = (candidate: string) =>
    prisma.user.findFirst({
      where: { username: { equals: candidate, mode: "insensitive" } },
    })
  if (!(await taken(baseUsername))) {
    return baseUsername
  }
  for (;;) {
    const candidate = `${baseUsername}_${Math.random().toString(36).substring(2, 6)}`
    if (!(await taken(candidate))) {
      return candidate
    }
  }
}

/**
 * Resolve the app user backing a Google sign-in, creating one when needed and
 * attaching the OAuth account row.
 *
 * Returns null when the Google account must NOT be linked:
 * - the email already belongs to a credentials (password) account. Without
 *   email verification we cannot prove who created it, so linking would let an
 *   attacker who pre-registered victim@gmail.com take over the victim's first
 *   Google sign-in. Refusing the merge is the safe interim behavior.
 *
 * Create/attach are race-safe: concurrent sign-ins for the same new email
 * recover from the P2002 instead of 500ing.
 */
export async function linkGoogleUser({
  email,
  name,
  image,
  account,
}: LinkGoogleUserArgs): Promise<LinkedGoogleUser | null> {
  let user = await prisma.user.findUnique({ where: { email } })

  if (user?.password) {
    return null
  }

  if (!user) {
    const baseLocal = email.split("@")[0].replace(/[^a-zA-Z0-9_-]/g, "_")
    const baseUsername = baseLocal.length >= 3 ? baseLocal : baseLocal.padEnd(3, "_")

    // Concurrency-safe create: if a P2002 comes back, either the same email won
    // the race (re-resolve it) or the auto-generated username collided on an
    // unrelated row (unique per LOWER(username)). The latter re-rolls the
    // username and retries before giving up.
    let lastError: unknown
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        user = await prisma.user.create({
          data: {
            username: attempt === 0 ? baseUsername : await uniqueUsername(baseUsername),
            email,
            fullname: name || baseUsername,
            avatarUrl: image || null,
          },
        })
        break
      } catch (error) {
        lastError = error
        if (!isP2002(error)) throw error
        const winner = await prisma.user.findUnique({ where: { email } })
        if (winner) {
          user = winner
          break
        }
      }
    }
    if (!user) throw lastError
  }

  const providerAccountId = account?.providerAccountId
  if (providerAccountId) {
    const exists = await prisma.account.findFirst({
      where: { provider: "google", providerAccountId },
    })
    if (!exists) {
      try {
        await prisma.account.create({
          data: {
            userId: user.id,
            type: "oauth",
            provider: "google",
            providerAccountId,
            access_token: account.access_token,
            id_token: account.id_token,
          },
        })
      } catch (err) {
        if (!isP2002(err)) throw err
        // Account row was attached by a concurrent request — already linked.
      }
    }
  }

  return { id: user.id, username: user.username, email: user.email }
}