import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { updateServiceSchema } from "@/lib/validations/service"
import { success, error } from "@/lib/api-response"
import { toServiceTableItem } from "@/lib/dto/service.dto"

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
      return error("Servicio no encontrado", 404)
    }

    return success(toServiceTableItem(service))
  } catch (err) {
    console.error("[GET /api/services/:id]", err)
    return error("Error al obtener el servicio")
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
    const parsed = updateServiceSchema.safeParse(body)

    if (!parsed.success) {
      return error("Datos inválidos", 400, parsed.error.issues.map((i) => i.message))
    }

    const existing = await prisma.service.findUnique({
      where: { id },
    })

    if (!existing) {
      return error("Servicio no encontrado", 404)
    }

    const service = await prisma.service.update({
      where: { id },
      data: {
        ...(parsed.data.name !== undefined && { name: parsed.data.name }),
        ...(parsed.data.description !== undefined && { description: parsed.data.description }),
        ...(parsed.data.price !== undefined && { price: parsed.data.price }),
        ...(parsed.data.duration !== undefined && { duration: parsed.data.duration }),
        ...(parsed.data.category !== undefined && { category: parsed.data.category }),
        ...(parsed.data.imageUrl !== undefined && { imageUrl: parsed.data.imageUrl }),
        ...(parsed.data.isActive !== undefined && { isActive: parsed.data.isActive }),
      },
    })

    return success(toServiceTableItem(service))
  } catch (err) {
    console.error("[PUT /api/services/:id]", err)
    return error("Error al actualizar el servicio")
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
      return error("Servicio no encontrado", 404)
    }

    await prisma.service.delete({
      where: { id },
    })

    return success(null)
  } catch (err) {
    console.error("[DELETE /api/services/:id]", err)
    return error("Error al eliminar el servicio")
  }
}
