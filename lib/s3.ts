import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3"

export const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
})

export const R2_BUCKET = process.env.R2_BUCKET_NAME || "linkinbio"
export const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL || ""

export async function deleteFromR2(avatarUrl: string) {
  const key = extractR2Key(avatarUrl)
  if (!key) return
  try {
    await r2.send(new DeleteObjectCommand({ Bucket: R2_BUCKET, Key: key }))
  } catch {
    // best-effort cleanup — don't fail the request if delete fails
  }
}

function extractR2Key(avatarUrl: string): string | null {
  if (R2_PUBLIC_URL && avatarUrl.startsWith(R2_PUBLIC_URL)) {
    return avatarUrl.slice(R2_PUBLIC_URL.length + 1)
  }
  if (avatarUrl.startsWith("/avatars/")) {
    return avatarUrl.slice(1)
  }
  return null
}
