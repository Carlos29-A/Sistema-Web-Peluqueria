import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { appointmentSchema } from "@/lib/validations/appointment"
import { success, paginated, error } from "@/lib/api-response"
import { toAppointmentTableItem } from "@/lib/dto/appointment.dto"

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
    const body = await request.json()
    const parsed = appointmentSchema.safeParse(body)

    if (!parsed.success) {
      return error("Datos inválidos", 400, parsed.error.issues.map((i) => i.message))
    }

    const { appointmentDate, ...rest } = parsed.data

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
