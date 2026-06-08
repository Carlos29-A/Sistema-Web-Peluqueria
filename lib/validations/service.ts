import { z } from "zod"

export const serviceSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio").max(100, "Máximo 100 caracteres"),
  description: z.string().max(500, "Máximo 500 caracteres").optional().nullable(),
  price: z.number().positive("El precio debe ser mayor a 0"),
  duration: z.number().int().min(1, "Mínimo 1 minuto").max(300, "Máximo 300 minutos"),
  category: z.string().max(50).optional().nullable(),
  imageUrl: z.string().url("Debe ser una URL válida").optional().nullable(),
  isActive: z.boolean(),
})

export type ServiceInput = z.infer<typeof serviceSchema>

export const serviceIdSchema = z.object({
  id: z.string().cuid("ID inválido"),
})
