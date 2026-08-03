import { z } from "zod"

// Must match GradientColorPicker — the UI lets users add this many gradient
// colors, and the API must accept exactly what the UI produces.
export const MAX_GRADIENT_COLORS = 6

export const cardCreateSchema = z.object({
  name: z.string().max(100).optional(),
})

export const cardUpdateSchema = z.object({
  name: z.string().max(100).optional(),
  bio: z.string().max(500).nullable().optional(),
  is_public: z.boolean().optional(),
})

const color = z.string().regex(/^[a-fA-F0-9]{6}$/, "must be a 6-digit hex color")

const profileImageUrl = z
  .string()
  .max(2048)
  .refine((value) => {
    try {
      const url = new URL(value)
      return url.protocol === "http:" || url.protocol === "https:"
    } catch {
      return false
    }
  }, "profile_image must be an http(s) URL")
  .nullable()
  .optional()

const cardStyleSchema = z.object({
  card_bg: color.optional(),
  bg_type: z.enum(["solid", "gradient", "image"]).optional(),
  text_color: color.optional(),
  button_radius: z.enum(["pill", "round", "square", "rounder"]).optional(),
  button_bg: color.optional(),
  button_color: color.optional(),
  button_type: z.enum(["solid", "glass", "outline"]).optional(),
  profile_image: profileImageUrl,
  shadow: z.enum(["none", "soft", "medium", "hard", "glow"]).nullable().optional(),
  shadow_color: color.nullable().optional(),
  font_style: z.string().max(100).optional(),
  gradient: z.array(color).max(MAX_GRADIENT_COLORS).optional(),
  title_size: z.enum(["large", "medium", "small"]).optional(),
  text_size: z.enum(["large", "medium", "small"]).optional(),
  gradient_type: z.enum(["linear", "radial"]).optional(),
  gradient_direction: z.number().int().min(0).max(360).optional(),
  title_color: color.nullable().optional(),
  name: z.string().max(60).optional(),
})

export const cardStyleUpdateSchema = z.object({
  style: cardStyleSchema
    .refine((s) => Object.keys(s).length > 0, {
      message: "At least one style field is required",
    })
    .superRefine((s, ctx) => {
      // A gradient background needs at least two stops or it falls back to a
      // plain color at render time — reject it up front instead.
      if (s.bg_type === "gradient" && (s.gradient?.length ?? 0) < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Gradient backgrounds require at least 2 colors",
        })
      }
    }),
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
