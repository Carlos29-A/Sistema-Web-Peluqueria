import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { gallerySchema } from "@/lib/validations/gallery"
import { error, paginated } from "@/lib/api-response"
import { toGalleryTableItem } from "@/lib/dto/gallery.dto"
import { requireSession } from "@/lib/auth-guard"
import { rateLimit, getClientIp } from "@/lib/rate-limit"

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
    const search = searchParams.get("search")
    const page = Math.max(1, Number(searchParams.get("page")) || 1)
    const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit")) || 20))
    const skip = (page - 1) * limit

    const where: Record<string, unknown> = {}
    if (category) where.category = category
    if (featured === "true") where.isFeatured = true
    if (staffId) where.staffId = staffId
    if (search) {
      where.OR = [
        { description: { contains: search, mode: "insensitive" } },
        { category: { contains: search, mode: "insensitive" } },
      ]
    }

    const [gallery, total] = await Promise.all([
      prisma.gallery.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include,
      }),
      prisma.gallery.count({ where }),
    ])

    return paginated(gallery.map((g) => toGalleryTableItem(g)), { page, limit, total })
  } catch (err) {
    console.error("[GET /api/gallery]", err)
    return error("Error al obtener la galería")
  }
}
// Crear nueva imagen en la galería
export async function POST(request: NextRequest) {
  try {
    const session = await requireSession();
    if (!session) {
      return error("No autorizado", 401)
    }

    const ip = getClientIp(request)
    const { allowed } = rateLimit(`gallery:${ip}`, 10, 60_000)
    if (!allowed) {
      return error("Demasiadas solicitudes. Intentá de nuevo en un minuto.", 429)
    }

    const body = await request.json()
    const parsed = gallerySchema.safeParse(body)

    if (!parsed.success) {
      return error("Datos inválidos", 400, parsed.error.issues.map((i) => i.message))
    }
    const gallery = await prisma.gallery.create({
      data: parsed.data,
      include,
    })

    return NextResponse.json({ gallery }, { status: 201 })
  } catch (err) {
    console.error("[POST /api/gallery]", err)
    return error("Error al crear la imagen de galería", 500)
  }
}
