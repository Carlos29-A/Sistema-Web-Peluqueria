import StaffTable from "./components/StaffTable"
import { Users } from "lucide-react"

export default function StaffPage() {
  return (
    <div className="space-y-6">
      <div className="bg-linear-to-r from-amber-500 to-orange-500 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Equipo</h2>
            <p className="text-amber-100 text-sm mt-0.5">
              Gestiona los miembros de tu equipo
            </p>
          </div>
        </div>
      </div>

      <StaffTable />
    </div>
  )
}
