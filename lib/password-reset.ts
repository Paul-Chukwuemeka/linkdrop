import { createHash, randomBytes } from "node:crypto"

export const RESET_TOKEN_TTL_MS = 3_600_000

export function hashResetToken(token: string): string {
  return createHash("sha256").update(token).digest("hex")
}

export function generateResetToken(): { token: string; tokenHash: string } {
  const token = randomBytes(32).toString("hex")
  return { token, tokenHash: hashResetToken(token) }
}
