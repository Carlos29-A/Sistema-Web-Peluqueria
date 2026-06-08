import { Clock, Star } from "lucide-react"
import { SERVICE_CATEGORIES } from "@/lib/constants/landing"

interface ServiceCardProps {
  name: string
  description: string | null
  price: number
  duration: number
  category: string | null
}

export default function ServiceCard({ name, description, price, duration, category }: ServiceCardProps) {
  const Icon = (category && SERVICE_CATEGORIES[category]) || SERVICE_CATEGORIES.default

  return (
    <div className="group relative bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      {category && (
        <div className="absolute -top-3 left-6 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold">
          <Star className="w-3 h-3 fill-current" />
          {category}
        </div>
      )}

      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
        <Icon className="w-6 h-6 text-amber-600" />
      </div>

      <h3 className="text-lg font-bold text-gray-900 mb-2">{name}</h3>
      {description && (
        <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 mb-4">
          {description}
        </p>
      )}

      <div className="flex items-end justify-between pt-4 border-t border-gray-100">
        <div>
          <p className="text-xs text-gray-500 mb-0.5">Desde</p>
          <p className="text-2xl font-bold text-gray-900">
            ${Number(price).toLocaleString("es-CL")}
          </p>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Clock className="w-3.5 h-3.5" />
          {duration} min
        </div>
      </div>
    </div>
  )
}
