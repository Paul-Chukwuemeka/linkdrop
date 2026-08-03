interface RateLimitEntry {
  count: number
  resetTime: number
}

const store = new Map<string, RateLimitEntry>()

function cleanup() {
  const now = Date.now()
  for (const [key, entry] of store) {
    if (now > entry.resetTime) {
      store.delete(key)
    }
  }
}

export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  cleanup()
  const now = Date.now()
  const entry = store.get(key)

  if (!entry || now > entry.resetTime) {
    store.set(key, { count: 1, resetTime: now + windowMs })
    return true
  }

  if (entry.count >= limit) {
    return false
  }

  entry.count++
  return true
}

function getClientIp(request: Request): string {
  // Note: x-forwarded-for is client-supplied and spoofable on any deployment
  // that does not overwrite it at the proxy/edge. Trust x-real-ip (or
  // cf-connecting-ip) first once the deployment guarantees they are
  // proxy-populated — otherwise attackers can rotate the header to bypass
  // the per-IP signup/login throttles.
  const forwarded = request.headers.get("x-forwarded-for")
  if (forwarded) return forwarded.split(",")[0].trim()
  const realIp = request.headers.get("x-real-ip")
  if (realIp) return realIp
  return "127.0.0.1"
}

export function checkRateLimit(request: Request, limit: number, windowMs: number): boolean {
  const ip = getClientIp(request)
  return rateLimit(ip, limit, windowMs)
}

const loginKey = (username: string) => `login:${username.trim().toLowerCase()}`

export function checkLoginRateLimit(
  request: Request,
  username: string,
  limit: number,
  windowMs: number
): boolean {
  if (!checkRateLimit(request, limit, windowMs)) return false
  return rateLimit(loginKey(username), limit, windowMs)
}

export function resetLoginRateLimit(username: string): void {
  store.delete(loginKey(username))
}
