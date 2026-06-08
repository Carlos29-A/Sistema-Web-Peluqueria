"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Clock, ArrowRight } from "lucide-react"
import { SERVICE_CATEGORIES } from "@/lib/constants/landing"

export interface ServiceCatalogCardProps {
  id: string
  name: string
  description: string | null
  price: number
  duration: number
  category: string | null
  imageUrl: string | null
}

export default function ServiceCatalogCard({
  id,
  name,
  description,
  price,
  duration,
  category,
  imageUrl,
}: ServiceCatalogCardProps) {
  const Icon =
    (category && SERVICE_CATEGORIES[category]) || SERVICE_CATEGORIES.default

  return (
    <motion.article
      layout
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92 }}
      transition={{
        layout: { type: "spring", stiffness: 350, damping: 32 },
        opacity: { duration: 0.25 },
        scale: { duration: 0.25 },
      }}
      className="group relative flex flex-col bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-[0_20px_50px_-12px_rgba(217,119,6,0.18)] hover:border-amber-200 transition-all duration-300"
    >
      {/* Imagen */}
      <div className="relative h-64 overflow-hidden bg-gradient-to-br from-amber-100 via-orange-50 to-amber-50">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Icon className="w-14 h-14 text-amber-300" />
          </div>
        )}
        {/* Overlay gradiente sutil en hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-amber-900/25 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badge categoría */}
        {category && (
          <div className="absolute top-3 right-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-sm text-amber-700 text-xs font-semibold shadow-sm">
            <Icon className="w-3.5 h-3.5" />
            {category}
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="flex flex-col flex-1 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-amber-700 transition-colors">
          {name}
        </h3>
        {description && (
          <p className="text-sm text-gray-600 leading-relaxed mb-4 flex-1">
            {description}
          </p>
        )}

        {/* Footer: precio + duración + CTA */}
        <div className="pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Desde</p>
              <p className="text-2xl font-extrabold text-amber-600">
                ${price.toLocaleString("es-CL")}
              </p>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 text-sm text-gray-600">
              <Clock className="w-4 h-4 text-gray-400" />
              <span>{duration} min</span>
            </div>
          </div>

          <Link
            href={`/reservar?servicio=${id}`}
            className="flex items-center justify-center gap-2 w-full px-5 py-3 text-sm font-semibold text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md group/btn"
          >
            Reservar ahora
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.article>
  )
}
