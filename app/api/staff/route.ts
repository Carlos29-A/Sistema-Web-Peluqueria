import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const staffSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio").max(100),
  role: z.string().min(1, "El rol es obligatorio").max(50),
  bio: z.string().max(500).optional().nullable(),
  photoUrl: z.string().url("Debe ser una URL válida").optional().nullable(),
  instagram: z.string().max(100).optional().nullable(),
  isActive: z.boolean().optional().default(true),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const activeOnly = searchParams.get("active") === "true"

    const staff = await prisma.staff.findMany({
      where: activeOnly ? { isActive: true } : undefined,
      orderBy: { createdAt: "desc" },
      include: {
        staffServices: {
          include: {
            service: { select: { id: true, name: true } },
          },
        },
        schedules: true,
      },
    })

    return NextResponse.json({ staff })
  } catch (error) {
    console.error("[GET /api/staff]", error)
    return NextResponse.json(
      { error: "Error al obtener el staff" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = staffSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos inválidos", issues: parsed.error.issues.map((i) => i.message) },
        { status: 400 }
      )
    }

    const staff = await prisma.staff.create({
      data: parsed.data,
    })

    return NextResponse.json({ staff }, { status: 201 })
  } catch (error) {
    console.error("[POST /api/staff]", error)
    return NextResponse.json(
      { error: "Error al crear el miembro del staff" },
      { status: 500 }
    )
  }
}
