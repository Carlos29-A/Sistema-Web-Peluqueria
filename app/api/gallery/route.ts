import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { gallerySchema } from "@/lib/validations/gallery"

const include = {
  staff: { select: { name: true } },
}
// Obtener imágenes de la galería con filtros opcionales: categoría, destacado, staffId
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const featured = searchParams.get("featured")
    const staffId = searchParams.get("staffId")

    const where: Record<string, unknown> = {}
    if (category) where.category = category
    if (featured === "true") where.isFeatured = true
    if (staffId) where.staffId = staffId

    const gallery = await prisma.gallery.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include,
    })

    return NextResponse.json({ gallery })
  } catch (error) {
    console.error("[GET /api/gallery]", error)
    return NextResponse.json(
      { error: "Error al obtener la galería" },
      { status: 500 }
    )
  }
}
// Crear nueva imagen en la galería
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = gallerySchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos inválidos", issues: parsed.error.issues.map((i) => i.message) },
        { status: 400 }
      )
    }

    const gallery = await prisma.gallery.create({
      data: parsed.data,
      include,
    })

    return NextResponse.json({ gallery }, { status: 201 })
  } catch (error) {
    console.error("[POST /api/gallery]", error)
    return NextResponse.json(
      { error: "Error al crear la imagen de galería" },
      { status: 500 }
    )
  }
}
