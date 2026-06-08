import GalleryGrid from "./components/GalleryGrid"
import { ImageIcon } from "lucide-react"

export default function GaleriaPage() {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-cyan-500 to-sky-500 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
            <ImageIcon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Galería</h2>
            <p className="text-cyan-100 text-sm mt-0.5">
              Muestra los mejores trabajos del salón
            </p>
          </div>
        </div>
      </div>

      <GalleryGrid />
    </div>
  )
}
