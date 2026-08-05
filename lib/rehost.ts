import { PutObjectCommand } from "@aws-sdk/client-s3"
import { createHash } from "crypto"
import { r2, R2_BUCKET, R2_PUBLIC_URL } from "@/lib/s3"
import { fetchWithTimeout } from "@/lib/http"

export const MAX_AVATAR_IMAGE_SIZE = 5 * 1024 * 1024 // 5MB
const FETCH_TIMEOUT = 10000 // 10s

const CONTENT_TYPE_TO_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/gif": "gif",
  "image/webp": "webp",
}

const ALLOWED_AVATAR_HOSTS = new Set([
  "lh3.googleusercontent.com",
  "pbs.twimg.com",
  "avatars.githubusercontent.com",
  "i.pravatar.cc",
])

/**
 * Fetch an external avatar image and re-host it on our own R2 storage so the
 * public page never depends on a third-party hotlink.
 *
 * SSRF guard: the allowlist is enforced on BOTH the initial URL and the final
 * URL after redirects — fetch follows redirects by default, so checking only
 * the original host would let a malicious redirect bypass the allowlist.
 */
export async function reHostAvatarUrl(url: string): Promise<string> {
  // Already re-hosted to our own storage — nothing to do.
  if (
    (R2_PUBLIC_URL && url.startsWith(R2_PUBLIC_URL)) ||
    url.startsWith("/avatars/")
  ) {
    return url
  }

  const urlObj = new URL(url)
  if (!ALLOWED_AVATAR_HOSTS.has(urlObj.hostname)) {
    throw new Error("Image host not allowed")
  }

  let response: Response
  try {
    response = await fetchWithTimeout(
      url,
      { headers: { "User-Agent": "LinkDrop/1.0" } },
      FETCH_TIMEOUT
    )
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Image fetch timed out")
    }
    throw error
  }

  if (!response.ok) throw new Error(`Failed to fetch image (HTTP ${response.status})`)

  // fetch followed redirects by default — the final hop must also be an
  // allowed host, or a malicious redirect just bypasses the allowlist.
  const finalHost = new URL(response.url).hostname
  if (!ALLOWED_AVATAR_HOSTS.has(finalHost)) {
    throw new Error("Image host not allowed")
  }

  const contentType = response.headers.get("content-type") || ""
  if (!contentType.startsWith("image/")) throw new Error("URL does not point to an image")

  const contentLength = Number(response.headers.get("content-length") || "0")
  if (contentLength > MAX_AVATAR_IMAGE_SIZE) throw new Error("Image exceeds 5MB limit")

  const buffer = Buffer.from(await response.arrayBuffer())
  if (buffer.length > MAX_AVATAR_IMAGE_SIZE) throw new Error("Image exceeds 5MB limit")

  const hash = createHash("sha256").update(buffer).digest("hex")
  const ext = CONTENT_TYPE_TO_EXT[contentType.split(";")[0].trim()] || "jpg"
  const key = `avatars/${hash}.${ext}`

  await r2.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: contentType.split(";")[0].trim(),
    })
  )

  return R2_PUBLIC_URL ? `${R2_PUBLIC_URL}/${key}` : `/${key}`
}