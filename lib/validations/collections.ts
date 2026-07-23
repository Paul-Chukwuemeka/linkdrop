import { z } from "zod"

export const collectionCreateSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(120, "Title must be at most 120 characters"),
  card_id: z.string().uuid("Invalid card ID"),
})

export const collectionUpdateSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(120, "Title must be at most 120 characters")
    .optional(),
})

export const collectionReorderSchema = z.object({
  card_id: z.string().uuid("Invalid card ID"),
  items: z.array(
    z.object({
      id: z.string().uuid(),
      position: z.number().int().min(0),
    })
  ),
})

export type CollectionCreateInput = z.infer<typeof collectionCreateSchema>
export type CollectionUpdateInput = z.infer<typeof collectionUpdateSchema>
export type CollectionReorderInput = z.infer<typeof collectionReorderSchema>
