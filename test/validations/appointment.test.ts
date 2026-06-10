import { describe, it, expect } from "vitest"
import { appointmentSchema, updateAppointmentSchema } from "@/lib/validations/appointment"

describe("appointmentSchema", () => {
  const validAppointment = {
    clientName: "María González",
    clientEmail: "maria@ejemplo.com",
    clientPhone: "+56912345678",
    serviceId: "clqxyz1234567abcdefghijk",
    staffId: "clqxyz1234567abcdefghijl",
    appointmentDate: "2026-06-15",
    appointmentTime: "10:30",
    notes: "Sin sulfatos",
    totalPrice: 25000,
  }

  it("accepts valid appointment data", () => {
    const result = appointmentSchema.safeParse(validAppointment)
    expect(result.success).toBe(true)
  })

  it("rejects invalid email", () => {
    const result = appointmentSchema.safeParse({ ...validAppointment, clientEmail: "invalido" })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Email inválido")
    }
  })

  it("rejects invalid date format", () => {
    const result = appointmentSchema.safeParse({ ...validAppointment, appointmentDate: "15-06-2026" })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Formato de fecha inválido (YYYY-MM-DD)")
    }
  })

  it("rejects invalid time format", () => {
    const result = appointmentSchema.safeParse({ ...validAppointment, appointmentTime: "10:30:00" })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Formato de hora inválido (HH:MM)")
    }
  })

  it("accepts appointment without optional fields", () => {
    const result = appointmentSchema.safeParse({
      clientName: "Juan Pérez",
      clientEmail: "juan@ejemplo.com",
      clientPhone: "+56987654321",
      serviceId: "clqxyz1234567abcdefghijk",
      appointmentDate: "2026-06-20",
      appointmentTime: "15:00",
    })
    expect(result.success).toBe(true)
  })

  it("accepts status field when provided", () => {
    const result = appointmentSchema.safeParse({ ...validAppointment, status: "CONFIRMED" })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.status).toBe("CONFIRMED")
    }
  })
})

describe("updateAppointmentSchema", () => {
  it("accepts partial update with just status", () => {
    const result = updateAppointmentSchema.safeParse({ status: "COMPLETED" })
    expect(result.success).toBe(true)
  })

  it("accepts empty object (no updates)", () => {
    const result = updateAppointmentSchema.safeParse({})
    expect(result.success).toBe(true)
  })

  it("rejects invalid status", () => {
    const result = updateAppointmentSchema.safeParse({ status: "INVALID" })
    expect(result.success).toBe(false)
  })
})
