import AppointmentTable from "./components/AppointmentTable"
import { CalendarDays } from "lucide-react"

export default function CitasPage() {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-rose-500 to-pink-600 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
            <CalendarDays className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Citas</h2>
            <p className="text-rose-100 text-sm mt-0.5">
              Administra las citas y reservas del salón
            </p>
          </div>
        </div>
      </div>

      <AppointmentTable />
    </div>
  )
}
