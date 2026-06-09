import type { AppointmentStatus } from "@/types"
import { Calendar, CheckCircle2, Clock, XCircle } from "lucide-react"

type Status = AppointmentStatus

const config: Record<Status, { label: string; className: string; icon: typeof Clock }> = {
  PENDING: {
    label: "Pendiente",
    className: "bg-amber-50 text-amber-700 border-amber-200",
    icon: Clock,
  },
  CONFIRMED: {
    label: "Confirmada",
    className: "bg-indigo-50 text-indigo-700 border-indigo-200",
    icon: Calendar,
  },
  COMPLETED: {
    label: "Completada",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: CheckCircle2,
  },
  CANCELLED: {
    label: "Cancelada",
    className: "bg-red-50 text-red-600 border-red-200",
    icon: XCircle,
  },
}

export default function StatusBadge({ status }: { status: Status }) {
  const { label, className, icon: Icon } = config[status]
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${className}`}
    >
      <Icon className="w-3 h-3" />
      {label}
    </span>
  )
}
