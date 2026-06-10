import { describe, it, expect } from "vitest"
import { serviceSchema, updateServiceSchema } from "@/lib/validations/service"

describe("serviceSchema", () => {
  const validService = {
    name: "Corte de cabello",
    description: "Corte moderno",
    price: 15000,
    duration: 45,
    category: "Cortes",
    imageUrl: "https://res.cloudinary.com/test/image.jpg",
    isActive: true,
  }

  it("accepts valid service data", () => {
    const result = serviceSchema.safeParse(validService)
    expect(result.success).toBe(true)
  })

  it("rejects empty name", () => {
    const result = serviceSchema.safeParse({ ...validService, name: "" })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("El nombre es obligatorio")
    }
  })

  it("rejects negative price", () => {
    const result = serviceSchema.safeParse({ ...validService, price: -100 })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("El precio debe ser mayor a 0")
    }
  })

  it("rejects duration less than 1", () => {
    const result = serviceSchema.safeParse({ ...validService, duration: 0 })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Mínimo 1 minuto")
    }
  })

  it("rejects duration over 300", () => {
    const result = serviceSchema.safeParse({ ...validService, duration: 301 })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Máximo 300 minutos")
    }
  })

  it("accepts service without optional fields", () => {
    const result = serviceSchema.safeParse({
      name: "Corte",
      price: 10000,
      duration: 30,
      imageUrl: "https://res.cloudinary.com/test/image.jpg",
      isActive: true,
    })
    expect(result.success).toBe(true)
  })
})

describe("updateServiceSchema", () => {
  it("accepts partial update with just isActive", () => {
    const result = updateServiceSchema.safeParse({ isActive: false })
    expect(result.success).toBe(true)
  })

  it("accepts partial update with just price", () => {
    const result = updateServiceSchema.safeParse({ price: 20000 })
    expect(result.success).toBe(true)
  })

  it("rejects negative price in update", () => {
    const result = updateServiceSchema.safeParse({ price: -1 })
    expect(result.success).toBe(false)
  })
})
