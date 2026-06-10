import { describe, it, expect } from "vitest"
import { staffSchema, updateStaffSchema } from "@/lib/validations/staff"

describe("staffSchema", () => {
  const validStaff = {
    name: "María García",
    role: "Estilista",
    bio: "Especialista en coloración",
    photoUrl: "https://res.cloudinary.com/test/photo.jpg",
    instagram: "mariagarcia",
    isActive: true,
  }

  it("accepts valid staff data", () => {
    const result = staffSchema.safeParse(validStaff)
    expect(result.success).toBe(true)
  })

  it("rejects empty name", () => {
    const result = staffSchema.safeParse({ ...validStaff, name: "" })
    expect(result.success).toBe(false)
  })

  it("accepts staff without optional fields", () => {
    const result = staffSchema.safeParse({ name: "Carlos López", role: "Barbero", isActive: true })
    expect(result.success).toBe(true)
  })
})

describe("updateStaffSchema", () => {
  it("accepts partial update with isActive", () => {
    const result = updateStaffSchema.safeParse({ isActive: false })
    expect(result.success).toBe(true)
  })
})
