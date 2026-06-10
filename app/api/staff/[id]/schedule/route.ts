import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { success, error } from "@/lib/api-response"
import { requireSession } from "@/lib/auth-guard"

const scheduleBlockSchema = z.object({
  dayOfWeek: z.number().min(0).max(6),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, "Formato HH:MM inválido"),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, "Formato HH:MM inválido"),
})

const updateScheduleSchema = z.object({
  schedules: z.array(scheduleBlockSchema),
})

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const staff = await prisma.staff.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        schedules: {
          select: { dayOfWeek: true, startTime: true, endTime: true },
        },
      },
    })

    if (!staff) {
      return error("Miembro del staff no encontrado", 404)
    }

    return success(staff)
  } catch (err) {
    console.error("[GET /api/staff/:id/schedule]", err)
    return error("Error al obtener los horarios")
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
    const parsed = updateScheduleSchema.safeParse(body)

    if (!parsed.success) {
      return error("Datos inválidos", 400, parsed.error.issues.map((i) => i.message))
    }

    const existing = await prisma.staff.findUnique({ where: { id } })
    if (!existing) {
      return error("Miembro del staff no encontrado", 404)
    }

    await prisma.$transaction([
      prisma.schedule.deleteMany({ where: { staffId: id } }),
      ...parsed.data.schedules.map((block) =>
        prisma.schedule.create({
          data: {
            staffId: id,
            dayOfWeek: block.dayOfWeek,
            startTime: block.startTime,
            endTime: block.endTime,
          },
        })
      ),
    ])

    const updated = await prisma.staff.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        schedules: {
          select: { dayOfWeek: true, startTime: true, endTime: true },
        },
      },
    })

    return success(updated)
  } catch (err) {
    console.error("[PUT /api/staff/:id/schedule]", err)
    return error("Error al actualizar los horarios")
  }
}
