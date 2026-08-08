import { z } from "zod"

const httpUrl = z
  .string()
  .min(1, "URL is required")
  .max(2048, "URL must be at most 2048 characters")
  .refine(
    (value) => {
      try {
        const url = new URL(value)
        return url.protocol === "http:" || url.protocol === "https:"
      } catch {
        return false
      }
    },
    "URL must start with http:// or https://"
  )

export const linkCreateSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(120, "Title must be at most 120 characters"),
  url: httpUrl,
  card_id: z.string().uuid("Invalid card ID"),
  collection_id: z.string().uuid().nullable().optional(),
})

export const linkUpdateSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(120, "Title must be at most 120 characters")
    .optional(),
  url: httpUrl.optional(),
  collection_id: z.string().uuid().nullable().optional(),
})

export const ogFetchSchema = z.object({
  url: httpUrl,
})

export const collectionLinksReorderSchema = z.object({
  collection_id: z.string().uuid().nullable().optional(),
  items: z.array(
    z.object({
      id: z.string().uuid(),
      position: z.number().int().min(0),
    })
  ),
})

export type LinkCreateInput = z.infer<typeof linkCreateSchema>
export type LinkUpdateInput = z.infer<typeof linkUpdateSchema>
export type CollectionLinksReorderInput = z.infer<typeof collectionLinksReorderSchema>
