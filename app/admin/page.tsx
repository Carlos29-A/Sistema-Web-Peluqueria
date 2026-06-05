import { prisma } from "@/lib/prisma"
import { format, startOfDay, endOfDay, startOfMonth, endOfMonth } from "date-fns"
import { es } from "date-fns/locale"

async function getStats() {
  const today = new Date()
  const dayStart = startOfDay(today)
  const dayEnd = endOfDay(today)
  const monthStart = startOfMonth(today)
  const monthEnd = endOfMonth(today)

  const [
    todayAppointments,
    monthAppointments,
    pendingAppointments,
    totalServices,
    totalStaff,
    monthRevenue,
  ] = await Promise.all([
    prisma.appointment.count({
      where: { appointmentDate: { gte: dayStart, lte: dayEnd } },
    }),
    prisma.appointment.count({
      where: { appointmentDate: { gte: monthStart, lte: monthEnd } },
    }),
    prisma.appointment.count({ where: { status: "PENDING" } }),
    prisma.service.count({ where: { isActive: true } }),
    prisma.staff.count({ where: { isActive: true } }),
    prisma.appointment.aggregate({
      where: {
        status: { in: ["CONFIRMED", "COMPLETED"] },
        appointmentDate: { gte: monthStart, lte: monthEnd },
      },
      _sum: { totalPrice: true },
    }),
  ])

  return {
    todayAppointments,
    monthAppointments,
    pendingAppointments,
    totalServices,
    totalStaff,
    monthRevenue: monthRevenue._sum.totalPrice ?? 0,
  }
}

async function getRecentAppointments() {
  return prisma.appointment.findMany({
    take: 10,
    orderBy: { createdAt: "desc" },
    include: {
      service: { select: { name: true } },
      staff: { select: { name: true } },
    },
  })
}

const statusLabel: Record<string, string> = {
  PENDING: "Pendiente",
  CONFIRMED: "Confirmada",
  COMPLETED: "Completada",
  CANCELLED: "Cancelada",
}

export default async function AdminDashboard() {
  const stats = await getStats()
  const recentAppointments = await getRecentAppointments()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">Dashboard</h2>
        <p className="text-gray-500 text-sm mt-0.5">
          {format(new Date(), "EEEE d 'de' MMMM 'de' yyyy", { locale: es })}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-xs text-gray-500">Citas hoy</p>
          <p className="text-xl font-bold mt-1">{stats.todayAppointments}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-xs text-gray-500">Citas del mes</p>
          <p className="text-xl font-bold mt-1">{stats.monthAppointments}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-xs text-gray-500">Ingresos del mes</p>
          <p className="text-xl font-bold mt-1">${Number(stats.monthRevenue).toLocaleString("es-CL")}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-xs text-gray-500">Pendientes</p>
          <p className="text-xl font-bold mt-1">{stats.pendingAppointments}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-xs text-gray-500">Servicios activos</p>
          <p className="text-xl font-bold mt-1">{stats.totalServices}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-xs text-gray-500">Staff activo</p>
          <p className="text-xl font-bold mt-1">{stats.totalStaff}</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200">
          <h3 className="text-sm font-medium">Citas recientes</h3>
        </div>

        {recentAppointments.length === 0 ? (
          <div className="px-4 py-8 text-center text-gray-400 text-sm">
            No hay citas registradas
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500 text-xs">
                  <th className="text-left px-4 py-2.5 font-medium">Cliente</th>
                  <th className="text-left px-4 py-2.5 font-medium">Servicio</th>
                  <th className="text-left px-4 py-2.5 font-medium">Staff</th>
                  <th className="text-left px-4 py-2.5 font-medium">Fecha</th>
                  <th className="text-left px-4 py-2.5 font-medium">Hora</th>
                  <th className="text-left px-4 py-2.5 font-medium">Estado</th>
                  <th className="text-right px-4 py-2.5 font-medium">Precio</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentAppointments.map((apt) => (
                  <tr key={apt.id}>
                    <td className="px-4 py-2.5 font-medium">{apt.clientName}</td>
                    <td className="px-4 py-2.5 text-gray-600">{apt.service.name}</td>
                    <td className="px-4 py-2.5 text-gray-500">{apt.staff?.name ?? "—"}</td>
                    <td className="px-4 py-2.5 text-gray-500">{format(new Date(apt.appointmentDate), "dd/MM/yyyy")}</td>
                    <td className="px-4 py-2.5 text-gray-500">{apt.appointmentTime}</td>
                    <td className="px-4 py-2.5 text-gray-600">{statusLabel[apt.status]}</td>
                    <td className="px-4 py-2.5 text-right font-medium">${Number(apt.totalPrice ?? 0).toLocaleString("es-CL")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
