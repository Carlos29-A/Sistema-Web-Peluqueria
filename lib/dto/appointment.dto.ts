import type { Appointment } from "@/app/generated/prisma/client"
import type { AppointmentTableItem } from "@/types"

type AppointmentWithRelations = Appointment & {
  service: { name: string; price: unknown; duration: number }
  staff: { name: string } | null
}

export function toAppointmentTableItem(appointment: AppointmentWithRelations): AppointmentTableItem {
  return {
    id: appointment.id,
    clientName: appointment.clientName,
    clientEmail: appointment.clientEmail,
    clientPhone: appointment.clientPhone,
    serviceId: appointment.serviceId,
    staffId: appointment.staffId,
    appointmentDate: appointment.appointmentDate.toISOString().split("T")[0],
    appointmentTime: appointment.appointmentTime,
    status: appointment.status,
    notes: appointment.notes,
    totalPrice: appointment.totalPrice != null ? Number(appointment.totalPrice) : null,
    service: {
      name: appointment.service.name,
      price: Number(appointment.service.price),
      duration: appointment.service.duration,
    },
    staff: appointment.staff,
  }
}
