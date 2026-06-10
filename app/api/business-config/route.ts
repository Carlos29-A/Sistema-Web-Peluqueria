import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { businessConfigFormSchema } from "@/lib/validations/business-config"
import { success, error } from "@/lib/api-response"
import { requireSession } from "@/lib/auth-guard"

// función que devuelve la configuración de la aplicación
export async function GET() {
  try {
    const entries = await prisma.businessConfig.findMany()

    const config: Record<string, string> = {}
    for (const entry of entries) {
      config[entry.key] = entry.value
    }
    return success(config)
  } catch (err) {
    console.error("[GET /api/business-config]", err)
    return error("Error al obtener la configuración")
  }
}

// funcion que actualiza la configuración de la aplicación
export async function PUT(request: NextRequest) {
  try {
    const session = await requireSession();
    if (!session) {
      return error("No autorizado", 401)
    }
    const body = await request.json()
    const parsed = businessConfigFormSchema.safeParse(body)

    if (!parsed.success) {
      return error("Datos inválidos", 400, parsed.error.issues.map((i) => i.message))
    }

    const entries = Object.entries(parsed.data)

    for (const [key, value] of entries) {
      await prisma.businessConfig.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      })
    }

    const refreshed = await prisma.businessConfig.findMany()
    const config: Record<string, string> = {}
    for (const entry of refreshed) {
      config[entry.key] = entry.value
    }

    return success(config)
  } catch (err) {
    console.error("[PUT /api/business-config]", err)
    return error("Error al actualizar la configuración")
  }
}
