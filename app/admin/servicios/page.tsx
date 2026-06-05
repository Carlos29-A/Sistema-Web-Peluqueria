import ServiceTable from "./components/ServiceTable"
import { Sparkles } from "lucide-react"

export default function ServiciosPage() {
  return (
    <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
            <Sparkles className="w-6 h-6 text-purple-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Servicios</h2>
            <p className="text-black/50 text-sm mt-0.5">
              Gestiona los servicios de tu peluquería
            </p>
          </div>
        </div>
      <ServiceTable />
    </div>
  )
}
