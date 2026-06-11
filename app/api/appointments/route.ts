import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { appointmentSchema } from "@/lib/validations/appointment"
import { success, paginated, error } from "@/lib/api-response"
import { toAppointmentTableItem } from "@/lib/dto/appointment.dto"
import { rateLimit, getClientIp } from "@/lib/rate-limit"
import { isDateInPast, getScheduleForDay, timeToMinutes } from "@/lib/utils/availability"

const includeRelations = {
  service: { select: { name: true, price: true, duration: true } },
  staff: { select: { name: true } },
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const date = searchParams.get("date")
    const staffId = searchParams.get("staffId")
    const search = searchParams.get("search")
    const page = Math.max(1, Number(searchParams.get("page")) || 1)
    const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit")) || 20))
    const skip = (page - 1) * limit

    const where: Record<string, unknown> = {}
    if (status) where.status = status
    if (date) where.appointmentDate = { equals: new Date(date) }
    if (staffId) where.staffId = staffId
    if (search) {
      where.OR = [
        { clientName: { contains: search, mode: "insensitive" } },
        { clientEmail: { contains: search, mode: "insensitive" } },
      ]
    }

    const [appointments, total] = await Promise.all([
      prisma.appointment.findMany({
        where,
        orderBy: { appointmentDate: "asc" },
        skip,
        take: limit,
        include: includeRelations,
      }),
      prisma.appointment.count({ where }),
    ])

    return paginated(appointments.map(toAppointmentTableItem), { page, limit, total })
  } catch (err) {
    console.error("[GET /api/appointments]", err)
    return error("Error al obtener las citas")
  }
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request)
    const { allowed } = rateLimit(`appointments:${ip}`, 5, 60_000)
    if (!allowed) {
      return error("Demasiadas solicitudes. Intentá de nuevo en un minuto.", 429)
    }

    const body = await request.json()
    const parsed = appointmentSchema.safeParse(body)

    if (!parsed.success) {
      return error("Datos inválidos", 400, parsed.error.issues.map((i) => i.message))
    }
    const { appointmentDate, ...rest } = parsed.data

    // Validación: No permitir fechas pasadas
    if (isDateInPast(appointmentDate)) {
      return error("La fecha de la cita no puede ser en el pasado", 400)
    }

    //validación: horario laboral del staff
  
    if(parsed.data.staffId){
      const schedules = await prisma.schedule.findMany({
        where : {
          staffId: parsed.data.staffId
        }
      })
      const schedule = getScheduleForDay(schedules, appointmentDate)

      if(!schedule){
        return error("El estilista no trabaja en la fecha seleccionada", 400)
      }

      const citaMinutos = timeToMinutes(parsed.data.appointmentTime)
      const inicioMinutos = timeToMinutes(schedule.startTime)
      const finMinutos = timeToMinutes(schedule.endTime)

      if(citaMinutos < inicioMinutos || citaMinutos >= finMinutos){
        return error("La hora seleccionada está fuera del horario laboral del estilista", 400)
      }
      // Validación: el staff ofrece este servicio
      const staffService = await prisma.staffService.findUnique({
        where: {
          staffId_serviceId: {
            staffId: parsed.data.staffId,
            serviceId: parsed.data.serviceId,
          }
        }
      })
      if(!staffService){
        return error("El estilista no ofrece este servicio", 400)
      }
      // Validación: sin solapamiento con otras citas del mismo staff
      const servicio = await prisma.service.findUnique({
        where: { id: parsed.data.serviceId},
        select: { duration: true}
      })
      if (!servicio){
        return error("El servicio seleccionado no existe", 400)
      }
      const citasExistentes = await prisma.appointment.findMany({
        where: {
          staffId: parsed.data.staffId,
          appointmentDate: new Date(appointmentDate),
          status: { not: "CANCELLED"}
        },
        select: {
          appointmentTime: true,
          service: {
            select: {
              duration: true
            }
          }
        }
      })
      const nuevaInicio = timeToMinutes(parsed.data.appointmentTime)
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


    const appointment = await prisma.appointment.create({
      data: {
        ...rest,
        appointmentDate: new Date(appointmentDate),
      },
      include: includeRelations,
    })

    return success(toAppointmentTableItem(appointment), 201)
  } catch (err) {
    console.error("[POST /api/appointments]", err)
    return error("Error al crear la cita")
  }
}
