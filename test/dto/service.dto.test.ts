import { describe, it, expect } from "vitest"
import { toServiceTableItem } from "@/lib/dto/service.dto"

describe("toServiceTableItem", () => {
  it("converts Decimal price to number", () => {
    const service = {
      id: "clq1",
      name: "Corte",
      description: null,
      price: { toString: () => "15000.00" } as any,
      duration: 45,
      category: null,
      imageUrl: null,
      isActive: true,
    }

    const result = toServiceTableItem(service as any)
    expect(result.price).toBe(15000)
    expect(typeof result.price).toBe("number")
  })

  it("maps all required fields correctly", () => {
    const service = {
      id: "clq2",
      name: "Tinte",
      description: "Tinte profesional",
      price: { toString: () => "35000.50" } as any,
      duration: 90,
      category: "Color",
      imageUrl: "https://example.com/img.jpg",
      isActive: false,
    }

    const result = toServiceTableItem(service as any)
    expect(result.id).toBe("clq2")
    expect(result.name).toBe("Tinte")
    expect(result.price).toBe(35000.5)
    expect(result.duration).toBe(90)
    expect(result.category).toBe("Color")
    expect(result.imageUrl).toBe("https://example.com/img.jpg")
    expect(result.isActive).toBe(false)
  })
})
