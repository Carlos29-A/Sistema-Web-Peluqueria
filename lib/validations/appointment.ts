import { z } from "zod"

export const appointmentSchema = z.object({
  clientName: z.string().min(1, "El nombre es obligatorio").max(100),
  clientEmail: z.string().email("Email inválido"),
  clientPhone: z.string().min(7, "Teléfono inválido").max(20),
  serviceId: z.string().cuid("Servicio inválido"),
  staffId: z.string().cuid("Staff inválido").optional().nullable(),
  appointmentDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de fecha inválido (YYYY-MM-DD)"),
  appointmentTime: z
    .string()
    .regex(/^\d{2}:\d{2}$/, "Formato de hora inválido (HH:MM)"),
  notes: z.string().max(500).optional().nullable(),
  totalPrice: z.coerce.number().positive().optional().nullable(),
})

export const updateAppointmentSchema = z.object({
  clientName: z.string().min(1).max(100).optional(),
  clientEmail: z.string().email().optional(),
  clientPhone: z.string().min(7).max(20).optional(),
  serviceId: z.string().cuid().optional(),
  staffId: z.string().cuid().optional().nullable(),
  appointmentDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato inválido")
    .optional(),
  appointmentTime: z
    .string()
    .regex(/^\d{2}:\d{2}$/, "Formato inválido")
    .optional(),
  status: z.enum(["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"]).optional(),
  notes: z.string().max(500).optional().nullable(),
  totalPrice: z.coerce.number().positive().optional().nullable(),
})

export type AppointmentInput = z.infer<typeof appointmentSchema>
export type UpdateAppointmentInput = z.infer<typeof updateAppointmentSchema>
