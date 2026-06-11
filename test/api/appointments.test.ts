import { describe, it, expect, vi, beforeEach } from "vitest"
import { NextRequest } from "next/server"

// ─── Mocks ────────────────────────────────────────
vi.mock("@/lib/prisma", () => ({
  prisma: {
    schedule: { findMany: vi.fn() },
    staffService: { findUnique: vi.fn() },
    service: { findUnique: vi.fn() },
    appointment: {
      findMany: vi.fn(),
      count: vi.fn(),
      create: vi.fn(),
    },
  },
}))

vi.mock("@/lib/rate-limit", () => ({
  rateLimit: vi.fn(() => ({ allowed: true, remaining: 4 })),
  getClientIp: vi.fn(() => "127.0.0.1"),
}))

vi.mock("@/lib/logger", () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}))

// ─── Import AFTER mocks ───────────────────────────
import { prisma } from "@/lib/prisma"
import { POST, GET } from "@/app/api/appointments/route"

// ─── Test data (CUID format: 25 chars, starts with 'c') ──
const SERVICE_ID = "cn8n4a3l20000abc123456def"
const STAFF_ID = "cn8n4a3l20001xyz789012ghi"

const mockService = { id: SERVICE_ID, name: "Corte", price: 15000, duration: 60 }
const mockStaff = { id: STAFF_ID, name: "Ana" }
const mockSchedule = { dayOfWeek: 1, startTime: "09:00", endTime: "18:00" }
const mockAppointment = {
  id: "cn8n4a3l20002mno345678jkl",
  clientName: "María González",
  clientEmail: "maria@ejemplo.com",
  clientPhone: "+56912345678",
  serviceId: SERVICE_ID,
  staffId: STAFF_ID,
  appointmentDate: new Date("2026-06-15"),
  appointmentTime: "10:30",
  status: "PENDING",
  notes: null,
  totalPrice: null,
  reminderSent: false,
  createdAt: new Date(),
  updatedAt: new Date(),
  service: mockService,
  staff: mockStaff,
}

const validBody = {
  clientName: "María González",
  clientEmail: "maria@ejemplo.com",
  clientPhone: "+56912345678",
  serviceId: SERVICE_ID,
  staffId: STAFF_ID,
  appointmentDate: "2026-06-15",
  appointmentTime: "10:30",
  notes: "",
}

function mockRequest(body: unknown, url = "http://localhost:3000/api/appointments") {
  return new NextRequest(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
}

function mockGetRequest(url = "http://localhost:3000/api/appointments") {
  return new NextRequest(url)
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe("POST /api/appointments", () => {
  it("creates an appointment with valid data", async () => {
    vi.mocked(prisma.schedule.findMany).mockResolvedValue([mockSchedule])
    vi.mocked(prisma.staffService.findUnique).mockResolvedValue({
      staffId: "stf-1",
      serviceId: "svc-1",
    } as never)
    vi.mocked(prisma.service.findUnique).mockResolvedValue({ duration: 60 })
    vi.mocked(prisma.appointment.findMany).mockResolvedValue([])
    vi.mocked(prisma.appointment.create).mockResolvedValue(mockAppointment)

    const response = await POST(mockRequest(validBody))
    expect(response.status).toBe(201)

    const body = await response.json()
    expect(body.success).toBe(true)
    expect(body.data.clientName).toBe("María González")
  })

  it("rejects appointment in the past", async () => {
    const body = { ...validBody, appointmentDate: "2026-06-10" }
    const response = await POST(mockRequest(body))
    expect(response.status).toBe(400)

    const data = await response.json()
    expect(data.success).toBe(false)
    expect(data.error.message).toContain("pasado")
  })

  it("rejects appointment when staff doesn't work that day", async () => {
    vi.mocked(prisma.schedule.findMany).mockResolvedValue([]) // No schedules

    const body = { ...validBody, appointmentDate: "2026-06-15" }
    const response = await POST(mockRequest(body))
    expect(response.status).toBe(400)

    const data = await response.json()
    expect(data.success).toBe(false)
    expect(data.error.message).toContain("no trabaja")
  })

  it("rejects appointment when time is outside working hours", async () => {
    vi.mocked(prisma.schedule.findMany).mockResolvedValue([mockSchedule])
    vi.mocked(prisma.staffService.findUnique).mockResolvedValue({
      staffId: STAFF_ID,
      serviceId: SERVICE_ID,
    } as never)
    vi.mocked(prisma.service.findUnique).mockResolvedValue({ duration: 60 })
    vi.mocked(prisma.appointment.findMany).mockResolvedValue([])

    const body = { ...validBody, appointmentTime: "07:00" }
    const response = await POST(mockRequest(body))
    expect(response.status).toBe(400)

    const data = await response.json()
    expect(data.success).toBe(false)
    expect(data.error.message).toContain("fuera del horario")
  })

  it("rejects appointment when staff doesn't offer the service", async () => {
    vi.mocked(prisma.schedule.findMany).mockResolvedValue([mockSchedule])
    vi.mocked(prisma.staffService.findUnique).mockResolvedValue(null) // Not offered

    const body = {
      ...validBody,
      appointmentDate: "2026-06-15",
      appointmentTime: "10:00",
    }
    const response = await POST(mockRequest(body))
    expect(response.status).toBe(400)

    const data = await response.json()
    expect(data.success).toBe(false)
    expect(data.error.message).toContain("no ofrece")
  })

  it("rejects appointment with double booking", async () => {
    vi.mocked(prisma.schedule.findMany).mockResolvedValue([mockSchedule])
    vi.mocked(prisma.staffService.findUnique).mockResolvedValue({
      staffId: STAFF_ID,
      serviceId: SERVICE_ID,
    } as never)
    vi.mocked(prisma.service.findUnique).mockResolvedValue({ duration: 60 })
    vi.mocked(prisma.appointment.findMany).mockResolvedValue([
      { appointmentTime: "10:30", service: { duration: 60 } },
    ])

    const body = {
      ...validBody,
      appointmentDate: "2026-06-15",
      appointmentTime: "10:30",
    }
    const response = await POST(mockRequest(body))
    expect(response.status).toBe(409)

    const data = await response.json()
    expect(data.success).toBe(false)
    expect(data.error.message).toContain("Ya existe")
  })

  it("rejects appointment with invalid data (Zod)", async () => {
    const body = { ...validBody, clientEmail: "invalido" }
    const response = await POST(mockRequest(body))
    expect(response.status).toBe(400)

    const data = await response.json()
    expect(data.success).toBe(false)
    expect(data.error.issues).toBeDefined()
  })

  it("accepts appointment without staffId", async () => {
    vi.mocked(prisma.appointment.findMany).mockResolvedValue([])
    vi.mocked(prisma.appointment.create).mockResolvedValue(mockAppointment)

    const { staffId, ...bodyWithoutStaff } = validBody
    const response = await POST(mockRequest(bodyWithoutStaff))
    expect(response.status).toBe(201)

    const data = await response.json()
    expect(data.success).toBe(true)
  })

  it("returns 429 when rate limited", async () => {
    const rateLimit = await import("@/lib/rate-limit")
    vi.mocked(rateLimit.rateLimit).mockReturnValueOnce({ allowed: false, remaining: 0 })

    const response = await POST(mockRequest(validBody))
    expect(response.status).toBe(429)
  })
})

describe("GET /api/appointments", () => {
  it("returns paginated appointments", async () => {
    const typedMockAppointment = {
      ...mockAppointment,
      appointmentDate: new Date("2026-06-15"),
    }

    vi.mocked(prisma.appointment.findMany).mockResolvedValue([typedMockAppointment])
    vi.mocked(prisma.appointment.count).mockResolvedValue(1)

    const response = await GET(mockGetRequest())
    expect(response.status).toBe(200)

    const body = await response.json()
    expect(body.success).toBe(true)
    expect(body.data).toHaveLength(1)
    expect(body.meta.total).toBe(1)
    expect(body.meta.page).toBe(1)
  })

  it("filters by status", async () => {
    vi.mocked(prisma.appointment.findMany).mockResolvedValue([])
    vi.mocked(prisma.appointment.count).mockResolvedValue(0)

    const response = await GET(
      mockGetRequest("http://localhost:3000/api/appointments?status=PENDING")
    )
    expect(response.status).toBe(200)
  })

  it("filters by date", async () => {
    vi.mocked(prisma.appointment.findMany).mockResolvedValue([])
    vi.mocked(prisma.appointment.count).mockResolvedValue(0)

    const response = await GET(
      mockGetRequest("http://localhost:3000/api/appointments?date=2026-06-15")
    )
    expect(response.status).toBe(200)
  })
})
