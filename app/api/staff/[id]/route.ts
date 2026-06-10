import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { updateStaffSchema } from "@/lib/validations/staff"
import { success, error } from "@/lib/api-response"
import { toStaffTableItem } from "@/lib/dto/staff.dto"
import { requireSession } from "@/lib/auth-guard"

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
      return error("Miembro del staff no encontrado", 404)
    }

    return success(toStaffTableItem(staff))
  } catch (err) {
    console.error("[GET /api/staff/:id]", err)
    return error("Error al obtener el miembro del staff")
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireSession();
    if (!session) {
      return error("No autorizado", 401)
    }
    const { id } = await params

    const body = await request.json()
    const parsed = updateStaffSchema.safeParse(body)

    if (!parsed.success) {
      return error("Datos inválidos", 400, parsed.error.issues.map((i) => i.message))
    }

    const existing = await prisma.staff.findUnique({ where: { id } })
    if (!existing) {
      return error("Miembro del staff no encontrado", 404)
    }

    const staff = await prisma.staff.update({
      where: { id },
      data: parsed.data,
    })

    return success(toStaffTableItem(staff))
  } catch (err) {
    console.error("[PUT /api/staff/:id]", err)
    return error("Error al actualizar el miembro del staff")
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireSession();
    if (!session) {
      return error("No autorizado", 401)
    }
    const { id } = await params

    const existing = await prisma.staff.findUnique({ where: { id } })
    if (!existing) {
      return error("Miembro del staff no encontrado", 404)
    }

    await prisma.staff.delete({ where: { id } })

    return success(null)
  } catch (err) {
    console.error("[DELETE /api/staff/:id]", err)
    return error("Error al eliminar el miembro del staff")
  }
}
