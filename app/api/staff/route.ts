import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { staffSchema } from "@/lib/validations/staff"
import { error, paginated, success } from "@/lib/api-response"
import { toStaffTableItem } from "@/lib/dto/staff.dto"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const active = searchParams.get("active")
    const search = searchParams.get("search")
    const page = Math.max(1, Number(searchParams.get("page")) || 1)
    const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit")) || 20))
    const skip = (page - 1) * limit

    const where: Record<string, unknown> = {}
    if (active === "true") where.isActive = true
    if (active === "false") where.isActive = false
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { role: { contains: search, mode: "insensitive" } },
      ]
    }

    const [staff, total] = await Promise.all([
      prisma.staff.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          staffServices: {
            include: {
              service: { select: { id: true, name: true } },
            },
          },
          schedules: true,
        },
      }),
      prisma.staff.count({ where }),
    ])

    return paginated(staff.map((staff) => toStaffTableItem(staff)), { page, limit, total })
  } catch (err) {
    console.error("[GET /api/staff]", err)
    return error("Error al obtener el staff")
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = staffSchema.safeParse(body)

    if (!parsed.success) {
      return error("Datos inválidos", 400, parsed.error.issues.map((i) => i.message))
    }
    const staff = await prisma.staff.create({
      data: parsed.data,
    })

    return success(toStaffTableItem(staff), 201)
  } catch (err) {
    console.error("[POST /api/staff]", err)
    return error("Error al crear el miembro del staff")
  }
}
