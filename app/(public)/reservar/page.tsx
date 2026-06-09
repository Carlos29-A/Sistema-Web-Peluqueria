import type { Metadata } from "next"
import type { CatalogService, StaffWithSchedule } from "@/types"
import { prisma } from "@/lib/prisma"
import ReservationStepper from "@/components/public/sections/ReservationStepper"

export const metadata: Metadata = {
  title: "Reservar cita - GlamStudio",
  description:
    "Reserva tu cita en línea de forma rápida y sencilla. Selecciona el servicio, elige tu estilista favorita y confirma tu horario.",
}

async function getServices(): Promise<CatalogService[]> {
  const services = await prisma.service.findMany({
    where: { isActive: true },
    orderBy: { category: "asc" },
  })

  return services.map((s) => ({
    id: s.id,
    name: s.name,
    description: s.description,
    price: Number(s.price),
    duration: s.duration,
    category: s.category,
    imageUrl: s.imageUrl,
  }))
}

async function getStaff(): Promise<StaffWithSchedule[]> {
  const staff = await prisma.staff.findMany({
    where: { isActive: true },
    include: {
      staffServices: { select: { serviceId: true } },
      schedules: {
        select: { dayOfWeek: true, startTime: true, endTime: true },
      },
    },
  })

  return staff.map((s) => ({
    id: s.id,
    name: s.name,
    role: s.role,
    photoUrl: s.photoUrl,
    services: s.staffServices.map((ss) => ({ id: ss.serviceId })),
    schedules: s.schedules.map((sch) => ({
      dayOfWeek: sch.dayOfWeek,
      startTime: sch.startTime,
      endTime: sch.endTime,
    })),
  }))
}

export default async function ReservarPage({
  searchParams,
}: {
  searchParams: Promise<{ servicio?: string; staff?: string }>
}) {
  const params = await searchParams
  const [services, staff] = await Promise.all([getServices(), getStaff()])

  return (
    <ReservationStepper
      services={services}
      staff={staff}
      defaultServiceId={params.servicio}
      defaultStaffId={params.staff}
    />
  )
}
