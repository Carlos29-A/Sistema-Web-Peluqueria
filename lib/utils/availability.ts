import type { ScheduleSlot } from "@/types"

const DAY_NAMES = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]
const MONTH_NAMES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
]

export function getDayName(dayOfWeek: number): string {
  return DAY_NAMES[dayOfWeek] ?? ""
}

export function getMonthName(month: number): string {
  return MONTH_NAMES[month] ?? ""
}

export function formatDate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

export function parseDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number)
  return new Date(y, m - 1, d)
}

export function isDateInPast(dateStr: string): boolean {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const date = parseDate(dateStr)
  return date < today
}

export function getDayOfWeek(dateStr: string): number {
  return parseDate(dateStr).getDay()
}

export function getCalendarDays(year: number, month: number): (number | null)[] {
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const days: (number | null)[] = []
  for (let i = 0; i < firstDay; i++) {
    days.push(null)
  }
  for (let d = 1; d <= daysInMonth; d++) {
    days.push(d)
  }
  return days
}

export function getScheduleForDay(schedules: ScheduleSlot[], dateStr: string): ScheduleSlot | null {
  const dayOfWeek = getDayOfWeek(dateStr)
  return schedules.find((s) => s.dayOfWeek === dayOfWeek) ?? null
}

export function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number)
  return h * 60 + m
}

export function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`
}

export interface ExistingAppointment {
  appointmentTime: string
  service: { duration: number }
}

export interface AvailableSlot {
  time: string
  display: string
  disabled?: boolean
}

export function getAvailableSlots(
  schedule: ScheduleSlot,
  serviceDuration: number,
  existingAppointments: ExistingAppointment[]
): AvailableSlot[] {
  const start = timeToMinutes(schedule.startTime)
  const end = timeToMinutes(schedule.endTime)
  const slots: AvailableSlot[] = []

  for (let t = start; t + serviceDuration <= end; t += serviceDuration) {
    const slotTime = minutesToTime(t)
    const slotEnd = t + serviceDuration

    const isOccupied = existingAppointments.some((apt) => {
      const aptStart = timeToMinutes(apt.appointmentTime)
      const aptEnd = aptStart + apt.service.duration
      return t < aptEnd && slotEnd > aptStart
    })

    slots.push({
      time: slotTime,
      display: slotTime,
      disabled: isOccupied,
    })
  }

  return slots
}

export function getStaffsForService<T extends { services: { id: string }[] }>(
  staff: T[],
  serviceId: string
): T[] {
  return staff.filter((s) => s.services.some((svc) => svc.id === serviceId))
}
