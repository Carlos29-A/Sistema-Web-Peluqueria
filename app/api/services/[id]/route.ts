import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { serviceSchema } from "@/lib/validations/service"

// GET /api/services/[id] - Obtener un servicio por ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const service = await prisma.service.findUnique({
      where: { id },
    })

    if (!service) {
      return NextResponse.json(
        { error: "Servicio no encontrado" },
        { status: 404 }
      )
    }

    return NextResponse.json({ service })
  } catch (error) {
    console.error("[GET /api/services/:id]", error)
    return NextResponse.json(
      { error: "Error al obtener el servicio" },
      { status: 500 }
    )
  }
}

// PUT /api/services/[id] - Actualizar un servicio
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
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

    const existing = await prisma.service.findUnique({
      where: { id },
    })

    if (!existing) {
      return NextResponse.json(
        { error: "Servicio no encontrado" },
        { status: 404 }
      )
    }

    const service = await prisma.service.update({
      where: { id },
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

    return NextResponse.json({ service })
  } catch (error) {
    console.error("[PUT /api/services/:id]", error)
    return NextResponse.json(
      { error: "Error al actualizar el servicio" },
      { status: 500 }
    )
  }
}

// DELETE /api/services/[id] - Eliminar un servicio
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const existing = await prisma.service.findUnique({
      where: { id },
    })

    if (!existing) {
      return NextResponse.json(
        { error: "Servicio no encontrado" },
        { status: 404 }
      )
    }

    await prisma.service.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[DELETE /api/services/:id]", error)
    return NextResponse.json(
      { error: "Error al eliminar el servicio" },
      { status: 500 }
    )
  }
}
