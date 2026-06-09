import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { format, startOfDay, endOfDay, startOfMonth, endOfMonth } from "date-fns"
import { es } from "date-fns/locale"
import {
  CalendarDays,
  CalendarCheck,
  CircleDollarSign,
  Clock,
  Scissors,
  Users,
  ArrowRight,
  TrendingUp,
  Plus,
  Sparkles,
  Zap,
} from "lucide-react"
import StatusBadge from "./citas/components/StatusBadge"

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
    completedThisMonth,
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
    prisma.appointment.count({
      where: { status: "COMPLETED", appointmentDate: { gte: monthStart, lte: monthEnd } },
    }),
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
    completedThisMonth,
    totalServices,
    totalStaff,
    monthRevenue: monthRevenue._sum.totalPrice ?? 0,
  }
}

async function getRecentAppointments() {
  return prisma.appointment.findMany({
    take: 6,
    orderBy: { appointmentDate: "desc" },
    include: {
      service: { select: { name: true, duration: true } },
      staff: { select: { name: true } },
    },
  })
}

export default async function AdminDashboard() {
  const stats = await getStats()
  const recentAppointments = await getRecentAppointments()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-stone-800 rounded-2xl p-6 lg:p-8 text-white shadow-2xl">
        <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="absolute -left-8 -bottom-8 w-32 h-32 rounded-full bg-violet-500/10 blur-2xl" />

        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-medium text-amber-400 uppercase tracking-wider">Panel de control</span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold">Buenas {getTimeOfDay()}</h2>
            <p className="text-gray-300 text-sm mt-1 capitalize">
              {format(new Date(), "EEEE d 'de' MMMM 'de' yyyy", { locale: es })}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/admin/citas"
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl transition-all duration-200 border border-white/10"
            >
              <CalendarDays className="w-4 h-4" />
              Citas
            </Link>
            <Link
              href="/admin/configuracion"
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium bg-amber-500 hover:bg-amber-600 rounded-xl transition-all duration-200 shadow-lg shadow-amber-500/25"
            >
              Configurar
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <QuickAction
          href="/admin/citas"
          icon={Plus}
          label="Nueva cita"
          color="bg-blue-500"
        />
        <QuickAction
          href="/admin/servicios"
          icon={Scissors}
          label="Servicios"
          color="bg-violet-500"
        />
        <QuickAction
          href="/admin/staff"
          icon={Users}
          label="Staff"
          color="bg-emerald-500"
        />
        <QuickAction
          href="/admin/galeria"
          icon={Sparkles}
          label="Galería"
          color="bg-pink-500"
        />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Citas hoy"
          value={stats.todayAppointments}
          icon={CalendarDays}
          gradient="from-blue-500 to-indigo-600"
          bgLight="bg-blue-50"
          accent="border-l-blue-500"
        />
        <StatCard
          label="Citas del mes"
          value={stats.monthAppointments}
          icon={CalendarCheck}
          gradient="from-violet-500 to-purple-600"
          bgLight="bg-violet-50"
          accent="border-l-violet-500"
        />
        <StatCard
          label="Ingresos del mes"
          value={`$${Number(stats.monthRevenue).toLocaleString("es-CL")}`}
          icon={CircleDollarSign}
          gradient="from-emerald-500 to-teal-600"
          bgLight="bg-emerald-50"
          accent="border-l-emerald-500"
        />
        <StatCard
          label="Pendientes"
          value={stats.pendingAppointments}
          icon={Clock}
          gradient="from-amber-500 to-orange-600"
          bgLight="bg-amber-50"
          accent="border-l-amber-500"
          highlight={stats.pendingAppointments > 0}
        />
      </div>

      {/* Secondary Stats + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <MiniStatCard
          label="Completadas este mes"
          value={stats.completedThisMonth}
          icon={TrendingUp}
          color="text-emerald-600"
          bgColor="bg-emerald-50"
        />
        <MiniStatCard
          label="Servicios activos"
          value={stats.totalServices}
          icon={Scissors}
          color="text-violet-600"
          bgColor="bg-violet-50"
        />
        <MiniStatCard
          label="Staff activo"
          value={stats.totalStaff}
          icon={Users}
          color="text-blue-600"
          bgColor="bg-blue-50"
        />
      </div>

      {/* Recent Appointments */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Citas recientes</h3>
              <p className="text-xs text-gray-500">Últimas {recentAppointments.length} citas</p>
            </div>
          </div>
          <Link
            href="/admin/citas"
            className="text-xs font-medium text-amber-600 hover:text-amber-700 transition-colors flex items-center gap-1"
          >
            Ver todas
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {recentAppointments.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center mb-4">
              <CalendarDays className="w-8 h-8 text-amber-400" />
            </div>
            <p className="text-gray-900 font-medium mb-1">Sin citas aún</p>
            <p className="text-gray-500 text-sm mb-4">Las citas aparecerán aquí cuando se creen</p>
            <Link
              href="/admin/citas"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg transition"
            >
              <Plus className="w-4 h-4" />
              Crear primera cita
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {recentAppointments.map((apt, index) => (
              <div
                key={apt.id}
                className="flex items-center gap-4 px-6 py-3.5 hover:bg-gray-50/50 transition-colors group"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <span className="text-xs font-bold text-amber-700">
                    {apt.clientName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {apt.clientName}
                    </p>
                    <StatusBadge status={apt.status} />
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {apt.service.name} · {apt.service.duration}min
                    {apt.staff?.name ? ` · ${apt.staff.name}` : ""}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-gray-900">
                    ${Number(apt.totalPrice ?? 0).toLocaleString("es-CL")}
                  </p>
                  <p className="text-xs text-gray-400">
                    {format(new Date(apt.appointmentDate), "dd/MM")} · {apt.appointmentTime}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({
  label,
  value,
  icon: Icon,
  gradient,
  bgLight,
  accent,
  highlight = false,
}: {
  label: string
  value: number | string
  icon: React.ComponentType<{ className?: string }>
  gradient: string
  bgLight: string
  accent: string
  highlight?: boolean
}) {
  return (
    <div
      className={`relative bg-white rounded-xl border border-gray-200 border-l-4 ${accent} p-5 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 ${
        highlight ? "ring-2 ring-amber-200 shadow-amber-100" : ""
      }`}
    >
      <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full ${bgLight} opacity-40`} />
      <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg mb-3`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <p className="text-xs font-medium text-gray-500 mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  )
}

function MiniStatCard({
  label,
  value,
  icon: Icon,
  color,
  bgColor,
}: {
  label: string
  value: number
  icon: React.ComponentType<{ className?: string }>
  color: string
  bgColor: string
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
      <div className={`w-11 h-11 rounded-xl ${bgColor} flex items-center justify-center shrink-0`}>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <div>
        <p className="text-xl font-bold text-gray-900">{value}</p>
        <p className="text-xs text-gray-500">{label}</p>
      </div>
    </div>
  )
}

function QuickAction({
  href,
  icon: Icon,
  label,
  color,
}: {
  href: string
  icon: React.ComponentType<{ className?: string }>
  label: string
  color: string
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-4 py-3 bg-white border border-gray-200 rounded-xl hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group"
    >
      <div className={`w-9 h-9 rounded-lg ${color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
        <Icon className="w-4 h-4 text-white" />
      </div>
      <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
        {label}
      </span>
    </Link>
  )
}

function getTimeOfDay(): string {
  const hour = new Date().getHours()
  if (hour < 12) return "buenos días"
  if (hour < 18) return "buenas tardes"
  return "buenas noches"
}
