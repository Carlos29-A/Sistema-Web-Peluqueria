import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { appointmentSchema } from "@/lib/validations/appointment"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const date = searchParams.get("date")
    const staffId = searchParams.get("staffId")

    const where: Record<string, unknown> = {}
    if (status) where.status = status
    if (date) where.appointmentDate = { equals: date }
    if (staffId) where.staffId = staffId

    const appointments = await prisma.appointment.findMany({
      where,
      orderBy: { appointmentDate: "asc" },
      include: {
        service: { select: { name: true, price: true, duration: true } },
        staff: { select: { name: true } },
      },
    })

    return NextResponse.json({ appointments })
  } catch (error) {
    console.error("[GET /api/appointments]", error)
    return NextResponse.json(
      { error: "Error al obtener las citas" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = appointmentSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos inválidos", issues: parsed.error.issues.map((i) => i.message) },
        { status: 400 }
      )
    }

    const { appointmentDate, ...rest } = parsed.data

    const appointment = await prisma.appointment.create({
      data: {
        ...rest,
        appointmentDate: new Date(appointmentDate),
      },
      include: {
        service: { select: { name: true, price: true } },
        staff: { select: { name: true } },
      },
    })

    return NextResponse.json({ appointment }, { status: 201 })
  } catch (error) {
    console.error("[POST /api/appointments]", error)
    return NextResponse.json(
      { error: "Error al crear la cita" },
      { status: 500 }
    )
  }
}
