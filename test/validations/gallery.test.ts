import { describe, it, expect } from "vitest"
import { gallerySchema, updateGallerySchema } from "@/lib/validations/gallery"

describe("gallerySchema", () => {
  const validGallery = {
    imageUrl: "https://res.cloudinary.com/test/image.jpg",
    description: "Corte degradado",
    category: "Cortes",
    staffId: "clqxyz1234567abcdefghijk",
    isFeatured: false,
  }

  it("accepts valid gallery data", () => {
    const result = gallerySchema.safeParse(validGallery)
    expect(result.success).toBe(true)
  })

  it("rejects invalid image URL", () => {
    const result = gallerySchema.safeParse({ ...validGallery, imageUrl: "not-a-url" })
    expect(result.success).toBe(false)
  })

  it("accepts gallery with only required fields", () => {
    const result = gallerySchema.safeParse({ imageUrl: "https://res.cloudinary.com/test/img.jpg" })
    expect(result.success).toBe(true)
  })
})

describe("updateGallerySchema", () => {
  it("accepts partial update with isFeatured", () => {
    const result = updateGallerySchema.safeParse({ isFeatured: true })
    expect(result.success).toBe(true)
  })

  it("accepts partial update with imageUrl", () => {
    const result = updateGallerySchema.safeParse({ imageUrl: "https://res.cloudinary.com/test/new.jpg" })
    expect(result.success).toBe(true)
  })
})
