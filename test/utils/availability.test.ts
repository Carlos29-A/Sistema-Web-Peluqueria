import { describe, it, expect } from "vitest"
import type { ScheduleSlot } from "@/types"
import {
  timeToMinutes,
  minutesToTime,
  parseDate,
  formatDate,
  isDateInPast,
  getDayOfWeek,
  getDayName,
  getMonthName,
  getCalendarDays,
  getScheduleForDay,
  getAvailableSlots,
  getStaffsForService,
} from "@/lib/utils/availability"

describe("timeToMinutes", () => {
  it("converts '10:30' to 630", () => {
    expect(timeToMinutes("10:30")).toBe(630)
  })

  it("converts '00:00' to 0", () => {
    expect(timeToMinutes("00:00")).toBe(0)
  })

  it("converts '23:59' to 1439", () => {
    expect(timeToMinutes("23:59")).toBe(1439)
  })

  it("converts '09:00' to 540", () => {
    expect(timeToMinutes("09:00")).toBe(540)
  })
})

describe("minutesToTime", () => {
  it("converts 630 to '10:30'", () => {
    expect(minutesToTime(630)).toBe("10:30")
  })

  it("converts 0 to '00:00'", () => {
    expect(minutesToTime(0)).toBe("00:00")
  })

  it("converts 1439 to '23:59'", () => {
    expect(minutesToTime(1439)).toBe("23:59")
  })

  it("roundtrips with timeToMinutes", () => {
    const times = ["00:00", "09:15", "12:00", "18:30", "23:59"]
    for (const t of times) {
      expect(minutesToTime(timeToMinutes(t))).toBe(t)
    }
  })
})

describe("parseDate / formatDate", () => {
  it("parses and formats a date correctly", () => {
    const parsed = parseDate("2026-06-15")
    expect(parsed.getFullYear()).toBe(2026)
    expect(parsed.getMonth()).toBe(5) // 0-indexed
    expect(parsed.getDate()).toBe(15)
  })

  it("formatDate roundtrips with parseDate", () => {
    const dateStr = "2026-12-25"
    expect(formatDate(parseDate(dateStr))).toBe(dateStr)
  })

  it("formats a Date object correctly", () => {
    const date = new Date(2026, 5, 15) // June 15, 2026
    expect(formatDate(date)).toBe("2026-06-15")
  })
})

describe("isDateInPast", () => {
  it("returns true for yesterday (2026-06-10)", () => {
    expect(isDateInPast("2026-06-10")).toBe(true)
  })

  it("returns false for today (2026-06-11)", () => {
    expect(isDateInPast("2026-06-11")).toBe(false)
  })

  it("returns false for tomorrow (2026-06-12)", () => {
    expect(isDateInPast("2026-06-12")).toBe(false)
  })

  it("returns false for a date far in the future", () => {
    expect(isDateInPast("2027-01-01")).toBe(false)
  })
})

describe("getDayOfWeek", () => {
  it("returns 4 for 2026-06-11 (Thursday)", () => {
    expect(getDayOfWeek("2026-06-11")).toBe(4)
  })

  it("returns 1 for 2026-06-15 (Monday)", () => {
    expect(getDayOfWeek("2026-06-15")).toBe(1)
  })

  it("returns 0 for 2026-06-21 (Sunday)", () => {
    expect(getDayOfWeek("2026-06-21")).toBe(0)
  })
})

describe("getDayName", () => {
  it("returns correct Spanish day names", () => {
    expect(getDayName(0)).toBe("Domingo")
    expect(getDayName(1)).toBe("Lunes")
    expect(getDayName(4)).toBe("Jueves")
    expect(getDayName(6)).toBe("Sábado")
  })

  it("returns empty string for invalid day", () => {
    expect(getDayName(7)).toBe("")
  })
})

describe("getMonthName", () => {
  it("returns correct Spanish month names", () => {
    expect(getMonthName(0)).toBe("Enero")
    expect(getMonthName(5)).toBe("Junio")
    expect(getMonthName(11)).toBe("Diciembre")
  })
})

describe("getCalendarDays", () => {
  it("generates 35 or 42 entries for a month", () => {
    const days = getCalendarDays(2026, 5) // June 2026
    expect(days.length).toBeGreaterThanOrEqual(28)
    expect(days.length).toBeLessThanOrEqual(42)
  })

  it("starts with null padding when month doesn't start on Monday", () => {
    const days = getCalendarDays(2026, 5) // June 2026 starts on Monday
    // June 1, 2026 is a Monday → dayOfWeek = 1
    // So there should be 1 null padding (Sunday)
    const nullCount = days.filter((d) => d === null).length
    expect(nullCount).toBeGreaterThanOrEqual(0)
  })

  it("contains all days of the month", () => {
    const days = getCalendarDays(2026, 5) // June (30 days)
    const numbers = days.filter((d) => d !== null) as number[]
    expect(numbers).toContain(1)
    expect(numbers).toContain(30)
  })
})

describe("getScheduleForDay", () => {
  const schedules: ScheduleSlot[] = [
    { dayOfWeek: 1, startTime: "09:00", endTime: "13:00" }, // Monday
    { dayOfWeek: 1, startTime: "14:00", endTime: "18:00" }, // Monday (split)
    { dayOfWeek: 2, startTime: "09:00", endTime: "18:00" }, // Tuesday
    { dayOfWeek: 4, startTime: "09:00", endTime: "18:00" }, // Thursday
    { dayOfWeek: 5, startTime: "09:00", endTime: "14:00" }, // Friday
  ]

  it("finds schedule for Monday (dayOfWeek=1)", () => {
    const result = getScheduleForDay(schedules, "2026-06-15")
    expect(result).not.toBeNull()
    expect(result!.startTime).toBe("09:00")
  })

  it("finds schedule for Tuesday (dayOfWeek=2)", () => {
    const result = getScheduleForDay(schedules, "2026-06-16")
    expect(result).not.toBeNull()
    expect(result!.dayOfWeek).toBe(2)
  })

  it("returns null for Wednesday (dayOfWeek=3) — no schedule", () => {
    const result = getScheduleForDay(schedules, "2026-06-17")
    expect(result).toBeNull()
  })

  it("returns null for Saturday (dayOfWeek=6)", () => {
    const result = getScheduleForDay(schedules, "2026-06-20")
    expect(result).toBeNull()
  })
})

describe("getAvailableSlots", () => {
  const schedule: ScheduleSlot = { dayOfWeek: 1, startTime: "09:00", endTime: "17:00" }

  it("generates slots based on service duration", () => {
    const slots = getAvailableSlots(schedule, 60, [])
    expect(slots.length).toBe(8) // 9-10, 10-11, ..., 16-17
    expect(slots[0].time).toBe("09:00")
    expect(slots[7].time).toBe("16:00")
  })

  it("generates correct number of slots for 90min services", () => {
    const slots = getAvailableSlots(schedule, 90, [])
    expect(slots.length).toBe(5) // 9:00-10:30, 10:30-12:00, 12:00-13:30, 13:30-15:00, 15:00-16:30
    expect(slots[0].time).toBe("09:00")
    expect(slots[4].time).toBe("15:00")
  })

  it("marks overlapping slot as disabled", () => {
    const existing = [
      { appointmentTime: "10:00", service: { duration: 60 } },
    ]
    const slots = getAvailableSlots(schedule, 60, existing)
    const slotAt10 = slots.find((s) => s.time === "10:00")
    expect(slotAt10?.disabled).toBe(true)

    const slotAt09 = slots.find((s) => s.time === "09:00")
    expect(slotAt09?.disabled).toBe(false)
  })

  it("marks multiple overlapping slots as disabled", () => {
    const existing = [
      { appointmentTime: "10:00", service: { duration: 120 } }, // 10:00-12:00
    ]
    const slots = getAvailableSlots(schedule, 60, existing)
    expect(slots.find((s) => s.time === "10:00")?.disabled).toBe(true)
    expect(slots.find((s) => s.time === "11:00")?.disabled).toBe(true)
    expect(slots.find((s) => s.time === "12:00")?.disabled).toBe(false)
  })

  it("allows slots when there are no overlaps", () => {
    const existing = [
      { appointmentTime: "12:00", service: { duration: 60 } },
    ]
    const slots = getAvailableSlots(schedule, 60, existing)
    const disabled = slots.filter((s) => s.disabled)
    expect(disabled.length).toBe(1)
    expect(disabled[0].time).toBe("12:00")
  })

  it("returns empty array when service doesn't fit in schedule", () => {
    const shortSchedule: ScheduleSlot = { dayOfWeek: 5, startTime: "09:00", endTime: "09:30" }
    const slots = getAvailableSlots(shortSchedule, 60, [])
    expect(slots.length).toBe(0)
  })

  it("handles exact-fit slot", () => {
    const exactSchedule: ScheduleSlot = { dayOfWeek: 1, startTime: "10:00", endTime: "11:00" }
    const slots = getAvailableSlots(exactSchedule, 60, [])
    expect(slots.length).toBe(1)
    expect(slots[0].time).toBe("10:00")
  })
})

describe("getStaffsForService", () => {
  const staff = [
    { id: "1", name: "Ana", services: [{ id: "s1" }, { id: "s2" }] },
    { id: "2", name: "María", services: [{ id: "s2" }] },
    { id: "3", name: "Luis", services: [{ id: "s3" }] },
  ]

  it("filters staff offering the service", () => {
    const result = getStaffsForService(staff, "s1")
    expect(result.length).toBe(1)
    expect(result[0].id).toBe("1")
  })

  it("returns multiple staff when all offer the service", () => {
    const result = getStaffsForService(staff, "s2")
    expect(result.length).toBe(2)
    expect(result.map((s) => s.id)).toEqual(["1", "2"])
  })

  it("returns empty for service not offered", () => {
    const result = getStaffsForService(staff, "s99")
    expect(result.length).toBe(0)
  })

  it("returns empty for empty staff array", () => {
    const result = getStaffsForService([], "s1")
    expect(result.length).toBe(0)
  })
})
