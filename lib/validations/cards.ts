import { z } from "zod"

export const cardCreateSchema = z.object({
  name: z.string().max(100).optional(),
})

export const cardUpdateSchema = z.object({
  name: z.string().max(100).optional(),
})

const cardStyleSchema = z.object({
  card_bg: z.string().optional(),
  bg_type: z.enum(["solid", "gradient", "image"]).optional(),
  text_color: z.string().optional(),
  button_radius: z.enum(["pill", "round", "square", "rounder"]).optional(),
  button_bg: z.string().optional(),
  button_color: z.string().optional(),
  button_type: z.enum(["solid", "glass", "outline"]).optional(),
  profile_image: z.string().nullable().optional(),
  shadow: z.enum(["none", "soft", "medium", "hard", "glow"]).nullable().optional(),
  font_style: z.string().optional(),
  gradient: z.array(z.string()).optional(),
  title_size: z.enum(["large", "medium", "small"]).optional(),
  text_size: z.enum(["large", "medium", "small"]).optional(),
  gradient_type: z.enum(["linear", "radial"]).optional(),
  gradient_direction: z.number().min(0).max(360).optional(),
  title_color: z.string().nullable().optional(),
})

export const cardStyleUpdateSchema = z.object({
  style: cardStyleSchema,
})

export const cardItemReorderSchema = z.object({
  items: z.array(
    z.object({
      type: z.enum(["link", "collection"]),
      id: z.string().uuid(),
      position: z.number().int().min(0),
    })
  ),
})

export type CardCreateInput = z.infer<typeof cardCreateSchema>
export type CardUpdateInput = z.infer<typeof cardUpdateSchema>
export type CardStyleUpdateInput = z.infer<typeof cardStyleUpdateSchema>
export type CardItemReorderInput = z.infer<typeof cardItemReorderSchema>
