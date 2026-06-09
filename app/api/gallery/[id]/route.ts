import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { updateGallerySchema } from "@/lib/validations/gallery"
import { error, success } from "@/lib/api-response"

const include = {
  staff: { select: { name: true } },
}

// Obtener una imagen de la galería por ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const gallery = await prisma.gallery.findUnique({
      where: { id },
      include,
    })

    if (!gallery) {
      return error("Imagen de galería no encontrada", 404)
    }

    return success(gallery)
  } catch (err) {
    console.error("[GET /api/gallery/:id]", err)
    return error("Error al obtener la imagen de galería")
  }
}

// Actualizar una imagen de la galería por ID
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const parsed = updateGallerySchema.safeParse(body)

    if (!parsed.success) {
      return error("Datos inválidos", 400, parsed.error.issues.map((i) => i.message))
    }

    const existing = await prisma.gallery.findUnique({ where: { id } })
    if (!existing) {
      return error("Imagen no encontrada", 404)
    }

    const gallery = await prisma.gallery.update({
      where: { id },
      data: parsed.data,
      include,
    })

    return success(gallery)
  } catch (err) {
    console.error("[PUT /api/gallery/:id]", err)
    return error("Error al actualizar la imagen", 500)
  }
}
// Eliminar una imagen de la galería por ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const existing = await prisma.gallery.findUnique({ where: { id } })
    if (!existing) {
      return error("Imagen no encontrada", 404)
    }

    await prisma.gallery.delete({ where: { id } })

    return success(null)
  } catch (err) {
    console.error("[DELETE /api/gallery/:id]", err)
    return error("Error al eliminar la imagen", 500)
  }
}
