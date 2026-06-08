import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { businessConfigSchema } from "@/lib/validations/business-config"

// funcion que devuelve la configuración de la aplicación
export async function GET() {
  try {
    const entries = await prisma.businessConfig.findMany()

    const config: Record<string, string> = {}
    for (const entry of entries) {
      config[entry.key] = entry.value
    }

    return NextResponse.json({ config })
  } catch (error) {
    console.error("[GET /api/business-config]", error)
    return NextResponse.json(
      { error: "Error al obtener la configuración" },
      { status: 500 }
    )
  }
}

// funcion que actualiza la configuración de la aplicación
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = businessConfigSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos inválidos", issues: parsed.error.issues.map((i) => i.message) },
        { status: 400 }
      )
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

    return NextResponse.json({ config })
  } catch (error) {
    console.error("[PUT /api/business-config]", error)
    return NextResponse.json(
      { error: "Error al actualizar la configuración" },
      { status: 500 }
    )
  }
}
