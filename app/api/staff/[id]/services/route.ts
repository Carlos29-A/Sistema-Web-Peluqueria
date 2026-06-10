import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { success, error } from "@/lib/api-response"
import { requireSession } from "@/lib/auth-guard"

const staffServicesSchema = z.object({
  serviceIds: z.array(z.string().cuid()),
})

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
    const parsed = staffServicesSchema.safeParse(body)

    if (!parsed.success) {
      return error("Datos inválidos", 400, parsed.error.issues.map((i) => i.message))
    }

    const existing = await prisma.staff.findUnique({ where: { id } })
    if (!existing) {
      return error("Miembro del staff no encontrado", 404)
    }

    await prisma.$transaction([
      prisma.staffService.deleteMany({ where: { staffId: id } }),
      prisma.staffService.createMany({
        data: parsed.data.serviceIds.map((serviceId) => ({
          staffId: id,
          serviceId,
        })),
      }),
    ])

    const updated = await prisma.staff.findUnique({
      where: { id },
      include: {
        staffServices: {
          include: {
            service: { select: { id: true, name: true } },
          },
        },
      },
    })

    return success(updated)
  } catch (err) {
    console.error("[PUT /api/staff/:id/services]", err)
    return error("Error al actualizar los servicios del staff")
  }
}
