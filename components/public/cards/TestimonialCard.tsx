import { Star } from "lucide-react"
import type { Testimonial } from "@/types"

export default function TestimonialCard({ name, role, content, rating }: Testimonial) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-shadow h-full flex flex-col">
      <div className="flex items-center gap-1 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < rating ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"
            }`}
          />
        ))}
      </div>
      <p className="text-sm text-gray-700 leading-relaxed flex-1">&ldquo;{content}&rdquo;</p>
      <div className="mt-4 pt-4 border-t border-gray-100">
        <p className="text-sm font-bold text-gray-900">{name}</p>
        <p className="text-xs text-amber-600">{role}</p>
      </div>
    </div>
  )
}
