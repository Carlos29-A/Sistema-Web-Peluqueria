import { z } from "zod"

export const serviceSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio").max(100, "Máximo 100 caracteres"),
  description: z.string().max(500, "Máximo 500 caracteres").optional().nullable(),
  price: z.number({ invalid_type_error: "Ingresa un precio válido" }).positive("El precio debe ser mayor a 0"),
  duration: z.number({ invalid_type_error: "Ingresa una duración válida" }).int().min(1, "Mínimo 1 minuto").max(300, "Máximo 300 minutos"),
  category: z.string().max(50).optional().nullable(),
  imageUrl: z.string().min(1, "Debes subir una imagen del servicio").url("Debe ser una URL válida"),
  isActive: z.boolean(),
})

export const updateServiceSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio").max(100).optional(),
  description: z.string().max(500).optional().nullable(),
  price: z.number({ invalid_type_error: "Ingresa un precio válido" }).positive("El precio debe ser mayor a 0").optional(),
  duration: z.number({ invalid_type_error: "Ingresa una duración válida" }).int().min(1, "Mínimo 1 minuto").max(300, "Máximo 300 minutos").optional(),
  category: z.string().max(50).optional().nullable(),
  imageUrl: z.string().url().optional().nullable(),
  isActive: z.boolean().optional(),
})

export type ServiceInput = z.infer<typeof serviceSchema>

export const serviceIdSchema = z.object({
  id: z.string().cuid("ID inválido"),
})
