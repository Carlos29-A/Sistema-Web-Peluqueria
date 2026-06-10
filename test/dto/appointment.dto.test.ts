import { describe, it, expect } from "vitest"
import { toAppointmentTableItem } from "@/lib/dto/appointment.dto"

describe("toAppointmentTableItem", () => {
  function createAppointment(overrides = {}) {
    return {
      id: "clq1",
      clientName: "María González",
      clientEmail: "maria@ejemplo.com",
      clientPhone: "+56912345678",
      serviceId: "clqs1",
      staffId: "clqst1",
      appointmentDate: new Date("2026-06-15"),
      appointmentTime: "10:30",
      status: "PENDING" as const,
      notes: null,
      totalPrice: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      service: {
        name: "Corte",
        price: { toString: () => "15000.00" } as any,
        duration: 45,
      },
      staff: { name: "María García" },
      ...overrides,
    }
  }

  it("converts Date to ISO date string", () => {
    const appointment = createAppointment({
      appointmentDate: new Date("2026-06-15"),
    })
    const result = toAppointmentTableItem(appointment as any)
    expect(result.appointmentDate).toBe("2026-06-15")
  })

  it("converts Decimal price to number", () => {
    const appointment = createAppointment({
      totalPrice: { toString: () => "25000.00" } as any,
    })
    const result = toAppointmentTableItem(appointment as any)
    expect(result.totalPrice).toBe(25000)
    expect(typeof result.totalPrice).toBe("number")
  })

  it("converts service.price Decimal to number", () => {
    const appointment = createAppointment()
    const result = toAppointmentTableItem(appointment as any)
    expect(result.service.price).toBe(15000)
    expect(typeof result.service.price).toBe("number")
  })

  it("handles null staff", () => {
    const appointment = createAppointment({ staff: null })
    const result = toAppointmentTableItem(appointment as any)
    expect(result.staff).toBeNull()
  })

  it("handles null totalPrice", () => {
    const appointment = createAppointment({ totalPrice: null })
    const result = toAppointmentTableItem(appointment as any)
    expect(result.totalPrice).toBeNull()
  })

  it("maps status correctly", () => {
    const appointment = createAppointment({ status: "CONFIRMED" })
    const result = toAppointmentTableItem(appointment as any)
    expect(result.status).toBe("CONFIRMED")
  })
})
