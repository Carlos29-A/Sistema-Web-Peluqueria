import { z } from "zod"

export const CURRENCIES = [
  { code: "USD", symbol: "$", name: "Dólar estadounidense" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "PEN", symbol: "S/", name: "Sol peruano" },
  { code: "MXN", symbol: "$", name: "Peso mexicano" },
  { code: "COP", symbol: "$", name: "Peso colombiano" },
  { code: "CLP", symbol: "$", name: "Peso chileno" },
  { code: "ARS", symbol: "$", name: "Peso argentino" },
] as const

export type CurrencyCode = (typeof CURRENCIES)[number]["code"]

export const currencyCodeSchema = z.enum(
  CURRENCIES.map((c) => c.code) as [CurrencyCode, ...CurrencyCode[]]
)

export const businessConfigFormSchema = z.object({
  business_name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres"),
  currency: currencyCodeSchema,
  phone: z
    .string()
    .max(20, "El teléfono no puede exceder 20 caracteres")
    .regex(
      /^[+]?[\d\s()-]*$/,
      "Formato de teléfono inválido (solo números, espacios, paréntesis, guiones y +)"
    )
    .default(""),
  whatsapp: z
    .string()
    .max(20, "El WhatsApp no puede exceder 20 caracteres")
    .regex(
      /^[+]?[\d\s()-]*$/,
      "Formato de WhatsApp inválido (solo números, espacios, paréntesis, guiones y +)"
    )
    .default(""),
  email: z
    .string()
    .max(100, "El email no puede exceder 100 caracteres")
    .email("Formato de email inválido")
    .or(z.literal(""))
    .default(""),
  address: z
    .string()
    .max(200, "La dirección no puede exceder 200 caracteres")
    .default(""),
  instagram: z
    .string()
    .max(50, "Instagram no puede exceder 50 caracteres")
    .regex(
      /^@?[\w.]+$/,
      "Formato de Instagram inválido (solo letras, números, puntos y guiones bajos)"
    )
    .default(""),
  facebook: z
    .string()
    .max(100, "Facebook no puede exceder 100 caracteres")
    .default(""),
  opening_hours: z
    .string()
    .max(300, "Los horarios no pueden exceder 300 caracteres")
    .default(""),
})

export type BusinessConfigFormInput = z.infer<typeof businessConfigFormSchema>

export function getCurrencySymbol(code: string): string {
  const currency = CURRENCIES.find((c) => c.code === code)
  return currency?.symbol ?? "$"
}
