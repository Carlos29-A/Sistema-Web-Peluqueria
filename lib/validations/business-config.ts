import { z } from "zod"

export const businessConfigSchema = z.record(
  z.string().min(1).max(50),
  z.string().max(500)
)

export type BusinessConfigInput = z.infer<typeof businessConfigSchema>
