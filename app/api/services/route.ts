import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { serviceSchema } from "@/lib/validations/service"
import { paginated, error, success } from "@/lib/api-response"
import { toServiceTableItem } from "@/lib/dto/service.dto"

// GET /api/services - Listar todos los servicios
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const activeOnly = searchParams.get("active") === "true"
    const search = searchParams.get("search")
    const page = Math.max(1, Number(searchParams.get("page")) || 1)
    const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit")) || 20))
    const skip = (page - 1) * limit

    const where: Record<string, unknown> = {}
    if (activeOnly) where.isActive = true
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { category: { contains: search, mode: "insensitive" } },
      ]
    }

    const [services, total] = await Promise.all([
      prisma.service.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.service.count({ where }),
    ])

    return paginated(services.map((service) => toServiceTableItem(service)), { page, limit, total })
  } catch (err) {
    console.error("[GET /api/services]", err)
    return error("Error al obtener los servicios")
  }
}

// POST /api/services - Crear un nuevo servicio
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = serviceSchema.safeParse(body)

    if (!parsed.success) {
      return error("Datos inválidos", 400, parsed.error.issues.map((i) => i.message))
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

    return success(toServiceTableItem(service), 201)
  } catch (err) {
    console.error("[POST /api/services]", err)
    return error("Error al crear el servicio")
  }
}
