import ServiceTable from "./components/ServiceTable"
import { Sparkles } from "lucide-react"

export default function ServiciosPage() {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Servicios</h2>
            <p className="text-violet-100 text-sm mt-0.5">
              Gestiona los servicios de tu peluquería
            </p>
          </div>
        </div>
      </div>

      <ServiceTable />
    </div>
  )
}
