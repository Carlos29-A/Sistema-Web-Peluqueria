import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { updateAppointmentSchema } from "@/lib/validations/appointment"
import { success, error } from "@/lib/api-response"
import { toAppointmentTableItem } from "@/lib/dto/appointment.dto"
import { requireSession } from "@/lib/auth-guard"
import { isDateInPast, getScheduleForDay, timeToMinutes, formatDate } from "@/lib/utils/availability"

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
    const session = await requireSession();
    if (!session) {
      return error("No autorizado", 401)
    }
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

    // 1️⃣ Validación: fecha en pasado
    if (parsed.data.appointmentDate && isDateInPast(parsed.data.appointmentDate)) {
      return error("La fecha de la cita no puede ser en el pasado", 400)
    }

    // Resolver valores efectivos (lo enviado o lo existente)
    const effectiveStaffId = parsed.data.staffId !== undefined ? parsed.data.staffId : existing.staffId
    const effectiveAppointmentDate = parsed.data.appointmentDate ?? formatDate(existing.appointmentDate)
    const effectiveAppointmentTime = parsed.data.appointmentTime ?? existing.appointmentTime
    const effectiveServiceId = parsed.data.serviceId ?? existing.serviceId

    if (effectiveStaffId) {
      // 2️⃣ Validación: horario laboral del staff
      const schedules = await prisma.schedule.findMany({
        where: { staffId: effectiveStaffId },
      })
      const schedule = getScheduleForDay(schedules, effectiveAppointmentDate)

      if (!schedule) {
        return error("El estilista no trabaja en la fecha seleccionada", 400)
      }

      const citaMinutos = timeToMinutes(effectiveAppointmentTime)
      const inicioMinutos = timeToMinutes(schedule.startTime)
      const finMinutos = timeToMinutes(schedule.endTime)

      if (citaMinutos < inicioMinutos || citaMinutos >= finMinutos) {
        return error("La hora seleccionada está fuera del horario laboral del estilista", 400)
      }

      // 3️⃣ Validación: el staff ofrece este servicio
      const staffService = await prisma.staffService.findUnique({
        where: {
          staffId_serviceId: {
            staffId: effectiveStaffId,
            serviceId: effectiveServiceId,
          },
        },
      })

      if (!staffService) {
        return error("El estilista no ofrece este servicio", 400)
      }

      // 4️⃣ Validación: sin solapamiento (excluyendo la cita actual)
      const servicio = await prisma.service.findUnique({
        where: { id: effectiveServiceId },
        select: { duration: true },
      })

      if (!servicio) {
        return error("El servicio seleccionado no existe", 400)
      }

      const citasExistentes = await prisma.appointment.findMany({
        where: {
          staffId: effectiveStaffId,
          appointmentDate: new Date(effectiveAppointmentDate),
          status: { not: "CANCELLED" },
          id: { not: id },
        },
        select: {
          appointmentTime: true,
          service: { select: { duration: true } },
        },
      })

      const nuevaInicio = timeToMinutes(effectiveAppointmentTime)
      const nuevaFin = nuevaInicio + servicio.duration

      const haySolapamiento = citasExistentes.some((cita) => {
        const citaInicio = timeToMinutes(cita.appointmentTime)
        const citaFin = citaInicio + cita.service.duration
        return nuevaInicio < citaFin && nuevaFin > citaInicio
      })

      if (haySolapamiento) {
        return error("Ya existe una cita en ese horario con el mismo estilista", 409)
      }
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
    const session = await requireSession();
    if (!session) {
      return error("No autorizado", 401)
    }
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
