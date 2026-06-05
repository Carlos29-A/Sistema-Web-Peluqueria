// Validar datos del login con Zod
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
})
// Tipado de loginSchema para el autocompletado y validación de datos
export type LoginInput = z.infer<typeof loginSchema>;
