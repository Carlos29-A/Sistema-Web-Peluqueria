import { z } from "zod"

export const staffSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio").max(100, "Máximo 100 caracteres"),
  role: z.string().min(1, "El rol es obligatorio").max(50, "Máximo 50 caracteres"),
  bio: z.string().max(500, "Máximo 500 caracteres").optional().nullable(),
  photoUrl: z.string().url("Debe ser una URL válida").optional().nullable(),
  instagram: z.string().max(100, "Máximo 100 caracteres").optional().nullable(),
  isActive: z.boolean().optional().default(true),
})

export const updateStaffSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  role: z.string().min(1).max(50).optional(),
  bio: z.string().max(500).optional().nullable(),
  photoUrl: z.string().url().optional().nullable(),
  instagram: z.string().max(100).optional().nullable(),
  isActive: z.boolean().optional(),
})

export type StaffInput = z.infer<typeof staffSchema>
export type UpdateStaffInput = z.infer<typeof updateStaffSchema>
