import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { updateAppointmentSchema } from "@/lib/validations/appointment"

const include = {
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
      include,
    })

    if (!appointment) {
      return NextResponse.json({ error: "Cita no encontrada" }, { status: 404 })
    }

    return NextResponse.json({ appointment })
  } catch (error) {
    console.error("[GET /api/appointments/:id]", error)
    return NextResponse.json(
      { error: "Error al obtener la cita" },
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
    const parsed = updateAppointmentSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos inválidos", issues: parsed.error.issues.map((i) => i.message) },
        { status: 400 }
      )
    }

    const existing = await prisma.appointment.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: "Cita no encontrada" }, { status: 404 })
    }

    const { appointmentDate, ...rest } = parsed.data

    const appointment = await prisma.appointment.update({
      where: { id },
      data: {
        ...rest,
        ...(appointmentDate && { appointmentDate: new Date(appointmentDate) }),
      },
      include,
    })

    return NextResponse.json({ appointment })
  } catch (error) {
    console.error("[PUT /api/appointments/:id]", error)
    return NextResponse.json(
      { error: "Error al actualizar la cita" },
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

    const existing = await prisma.appointment.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: "Cita no encontrada" }, { status: 404 })
    }

    await prisma.appointment.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[DELETE /api/appointments/:id]", error)
    return NextResponse.json(
      { error: "Error al eliminar la cita" },
      { status: 500 }
    )
  }
}
