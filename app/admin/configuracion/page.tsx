import type { Metadata } from "next"
import { Settings } from "lucide-react"
import ConfigForm from "./components/ConfigForm"

export const metadata: Metadata = {
  title: "Configuración - GlamStudio Admin",
}

export default function ConfiguracionPage() {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-gray-700 to-gray-900 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Configuración del Negocio</h2>
            <p className="text-gray-300 text-sm mt-0.5">
              Administra los datos de tu negocio que se muestran en la web
            </p>
          </div>
        </div>
      </div>

      <ConfigForm />
    </div>
  )
}
