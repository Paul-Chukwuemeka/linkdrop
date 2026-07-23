import { z } from "zod"

export const linkCreateSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(120, "Title must be at most 120 characters"),
  url: z
    .string()
    .min(1, "URL is required")
    .max(2048, "URL must be at most 2048 characters")
    .url("Invalid URL format"),
  card_id: z.string().uuid("Invalid card ID"),
  collection_id: z.string().uuid().nullable().optional(),
})

export const linkUpdateSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(120, "Title must be at most 120 characters")
    .optional(),
  url: z
    .string()
    .min(1, "URL is required")
    .max(2048, "URL must be at most 2048 characters")
    .url("Invalid URL format")
    .optional(),
  collection_id: z.string().uuid().nullable().optional(),
})

export const linkMoveSchema = z.object({
  collection_id: z.string().uuid().nullable().optional(),
})

export const linkReorderSchema = z.object({
  card_id: z.string().uuid("Invalid card ID"),
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
export type LinkMoveInput = z.infer<typeof linkMoveSchema>
export type LinkReorderInput = z.infer<typeof linkReorderSchema>
