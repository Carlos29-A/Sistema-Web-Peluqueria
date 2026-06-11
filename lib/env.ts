import { z } from "zod"

const envSchema = z.object({
  DATABASE_URL: z.string().url("DATABASE_URL debe ser una URL de conexión válida"),
  AUTH_SECRET: z.string().min(32, "AUTH_SECRET debe tener al menos 32 caracteres"),
  SENTRY_DSN: z.string().url().optional(),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  console.error("❌ Variables de entorno inválidas o faltantes:")
  for (const issue of parsed.error.issues) {
    console.error(`  - ${issue.path.join(".")}: ${issue.message}`)
  }
  console.error("\n📋 Revisá tu archivo .env y asegurate de tener todas las variables configuradas.")
  process.exit(1)
}

export const env = parsed.data
