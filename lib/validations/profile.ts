import { z } from "zod"
import { BIO_MAX_LENGTH } from "@/lib/validations/cards"

export const profileUpdateSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username must be at most 50 characters")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Username can only contain letters, numbers, underscores, and hyphens"
    )
    .optional(),
  fullname: z
    .string()
    .min(1, "Full name is required")
    .max(120, "Full name must be at most 120 characters")
    .optional(),
  bio: z
    .string()
    .max(BIO_MAX_LENGTH, `Bio must be at most ${BIO_MAX_LENGTH} characters`)
    .nullable()
    .optional(),
  avatar_url: z
    .string()
    .max(2048, "Avatar URL must be at most 2048 characters")
    .refine(
      (value) => {
        if (value === "") return true
        try {
          const url = new URL(value)
          return url.protocol === "http:" || url.protocol === "https:"
        } catch {
          return value.startsWith("/avatars/")
        }
      },
      "Avatar URL must be http(s) or a relative /avatars/ path"
    )
    .nullable()
    .optional(),
  theme: z.string().max(50).optional(),
})

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>
