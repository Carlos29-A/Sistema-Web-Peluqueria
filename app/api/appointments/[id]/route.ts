import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { updateAppointmentSchema } from "@/lib/validations/appointment"
import { success, error } from "@/lib/api-response"
import { toAppointmentTableItem } from "@/lib/dto/appointment.dto"

const includeRelations = {
  service: { select: { name: true, price: true, duration: true } },
  staff: { select: { name: true } },
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: includeRelations,
    })

    if (!appointment) {
      return error("Cita no encontrada", 404)
    }

    return success(toAppointmentTableItem(appointment))
  } catch (err) {
    console.error("[GET /api/appointments/:id]", err)
    return error("Error al obtener la cita")
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const parsed = updateAppointmentSchema.safeParse(body)

    if (!parsed.success) {
      return error("Datos inválidos", 400, parsed.error.issues.map((i) => i.message))
    }

    const existing = await prisma.appointment.findUnique({ where: { id } })
    if (!existing) {
      return error("Cita no encontrada", 404)
    }

    const { appointmentDate, ...rest } = parsed.data

    const appointment = await prisma.appointment.update({
      where: { id },
      data: {
        ...rest,
        ...(appointmentDate && { appointmentDate: new Date(appointmentDate) }),
      },
      include: includeRelations,
    })

    return success(toAppointmentTableItem(appointment))
  } catch (err) {
    console.error("[PUT /api/appointments/:id]", err)
    return error("Error al actualizar la cita")
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const existing = await prisma.appointment.findUnique({ where: { id } })
    if (!existing) {
      return error("Cita no encontrada", 404)
    }

    await prisma.appointment.delete({ where: { id } })

    return success(null)
  } catch (err) {
    console.error("[DELETE /api/appointments/:id]", err)
    return error("Error al eliminar la cita")
  }
}
