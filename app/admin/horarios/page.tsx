import { prisma } from "@/lib/prisma"
import { Clock } from "lucide-react"
import ScheduleEditor from "./components/ScheduleEditor"

export default async function HorariosPage() {
  const staffList = await prisma.staff.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "asc" },
    include: {
      schedules: {
        select: { dayOfWeek: true, startTime: true, endTime: true },
      },
    },
  })

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-gray-700 to-gray-900 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Gestión de Horarios</h2>
            <p className="text-gray-300 text-sm mt-0.5">
              Configura los días y horarios de trabajo de cada estilista
            </p>
          </div>
        </div>
      </div>

      {staffList.length === 0 ? (
        <div className="text-center py-12 text-gray-500 text-sm">
          No hay estilistas activos registrados.
        </div>
      ) : (
        <div className="space-y-4">
          {staffList.map((staff) => (
            <ScheduleEditor
              key={staff.id}
              staffId={staff.id}
              staffName={staff.name}
              staffRole={staff.role}
              initialSchedules={staff.schedules}
            />
          ))}
        </div>
      )}
    </div>
  )
}
