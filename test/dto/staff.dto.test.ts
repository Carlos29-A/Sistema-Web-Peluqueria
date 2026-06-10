import { describe, it, expect } from "vitest"
import { toStaffTableItem } from "@/lib/dto/staff.dto"

describe("toStaffTableItem", () => {
  const staff = {
    id: "clq1",
    name: "María García",
    role: "Estilista",
    bio: "Especialista en coloración",
    photoUrl: "https://example.com/photo.jpg",
    instagram: "mariagarcia",
    isActive: true,
  }

  it("maps all required fields correctly", () => {
    const result = toStaffTableItem(staff as any)
    expect(result.id).toBe("clq1")
    expect(result.name).toBe("María García")
    expect(result.role).toBe("Estilista")
    expect(result.isActive).toBe(true)
  })

  it("passes through nullable fields", () => {
    const result = toStaffTableItem({ ...staff, bio: null, photoUrl: null, instagram: null } as any)
    expect(result.bio).toBeNull()
    expect(result.photoUrl).toBeNull()
    expect(result.instagram).toBeNull()
  })
})
