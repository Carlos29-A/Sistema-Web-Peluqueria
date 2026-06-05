import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const staffSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  role: z.string().min(1).max(50).optional(),
  bio: z.string().max(500).optional().nullable(),
  photoUrl: z.string().url().optional().nullable(),
  instagram: z.string().max(100).optional().nullable(),
  isActive: z.boolean().optional(),
})

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const staff = await prisma.staff.findUnique({
      where: { id },
      include: {
        staffServices: {
          include: {
            service: { select: { id: true, name: true } },
          },
        },
        schedules: true,
      },
    })

    if (!staff) {
      return NextResponse.json({ error: "Miembro del staff no encontrado" }, { status: 404 })
    }

    return NextResponse.json({ staff })
  } catch (error) {
    console.error("[GET /api/staff/:id]", error)
    return NextResponse.json(
      { error: "Error al obtener el miembro del staff" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const parsed = staffSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos inválidos", issues: parsed.error.issues.map((i) => i.message) },
        { status: 400 }
      )
    }

    const existing = await prisma.staff.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: "Miembro del staff no encontrado" }, { status: 404 })
    }

    const staff = await prisma.staff.update({
      where: { id },
      data: parsed.data,
    })

    return NextResponse.json({ staff })
  } catch (error) {
    console.error("[PUT /api/staff/:id]", error)
    return NextResponse.json(
      { error: "Error al actualizar el miembro del staff" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const existing = await prisma.staff.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: "Miembro del staff no encontrado" }, { status: 404 })
    }

    await prisma.staff.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[DELETE /api/staff/:id]", error)
    return NextResponse.json(
      { error: "Error al eliminar el miembro del staff" },
      { status: 500 }
    )
  }
}
