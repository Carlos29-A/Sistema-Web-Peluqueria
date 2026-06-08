import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { updateGallerySchema } from "@/lib/validations/gallery"

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
      return NextResponse.json({ error: "Imagen no encontrada" }, { status: 404 })
    }

    return NextResponse.json({ gallery })
  } catch (error) {
    console.error("[GET /api/gallery/:id]", error)
    return NextResponse.json(
      { error: "Error al obtener la imagen" },
      { status: 500 }
    )
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
      return NextResponse.json(
        { error: "Datos inválidos", issues: parsed.error.issues.map((i) => i.message) },
        { status: 400 }
      )
    }

    const existing = await prisma.gallery.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: "Imagen no encontrada" }, { status: 404 })
    }

    const gallery = await prisma.gallery.update({
      where: { id },
      data: parsed.data,
      include,
    })

    return NextResponse.json({ gallery })
  } catch (error) {
    console.error("[PUT /api/gallery/:id]", error)
    return NextResponse.json(
      { error: "Error al actualizar la imagen" },
      { status: 500 }
    )
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
      return NextResponse.json({ error: "Imagen no encontrada" }, { status: 404 })
    }

    await prisma.gallery.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[DELETE /api/gallery/:id]", error)
    return NextResponse.json(
      { error: "Error al eliminar la imagen" },
      { status: 500 }
    )
  }
}
