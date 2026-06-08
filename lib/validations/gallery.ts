import { z } from "zod"

export const gallerySchema = z.object({
  imageUrl: z.string().url("Debe ser una URL válida"),
  description: z.string().max(500, "Máximo 500 caracteres").optional().nullable(),
  category: z.string().max(50).optional().nullable(),
  staffId: z.string().cuid("Staff inválido").optional().nullable(),
  isFeatured: z.boolean().optional().default(false),
})

export const updateGallerySchema = z.object({
  description: z.string().max(500).optional().nullable(),
  category: z.string().max(50).optional().nullable(),
  staffId: z.string().cuid().optional().nullable(),
  isFeatured: z.boolean().optional(),
})

export type GalleryInput = z.infer<typeof gallerySchema>
export type UpdateGalleryInput = z.infer<typeof updateGallerySchema>
