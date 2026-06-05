import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { serviceSchema } from "@/lib/validations/service"

// GET /api/services - Listar todos los servicios
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const activeOnly = searchParams.get("active") === "true"

    const services = await prisma.service.findMany({
      where: activeOnly ? { isActive: true } : undefined,
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ services })
  } catch (error) {
    console.error("[GET /api/services]", error)
    return NextResponse.json(
      { error: "Error al obtener los servicios" },
      { status: 500 }
    )
  }
}

// POST /api/services - Crear un nuevo servicio
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = serviceSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Datos inválidos",
          issues: parsed.error.issues.map((i) => i.message),
        },
        { status: 400 }
      )
    }

    const service = await prisma.service.create({
      data: {
        name: parsed.data.name,
        description: parsed.data.description,
        price: parsed.data.price,
        duration: parsed.data.duration,
        category: parsed.data.category,
        imageUrl: parsed.data.imageUrl,
        isActive: parsed.data.isActive,
      },
    })

    return NextResponse.json({ service }, { status: 201 })
  } catch (error) {
    console.error("[POST /api/services]", error)
    return NextResponse.json(
      { error: "Error al crear el servicio" },
      { status: 500 }
    )
  }
}
