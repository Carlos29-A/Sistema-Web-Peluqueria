"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { UserCircle, ChevronDown, Scissors, Image as ImageIcon } from "lucide-react"

export interface StaffCatalogCardProps {
  name: string
  role: string
  bio: string | null
  photoUrl: string | null
  servicesCount: number
  galleryCount: number
  isExpanded: boolean
  onClick: () => void
}

export default function StaffCatalogCard({
  name,
  role,
  bio,
  photoUrl,
  servicesCount,
  galleryCount,
  isExpanded,
  onClick,
}: StaffCatalogCardProps) {
  return (
    <motion.button
      layout="position"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      onClick={onClick}
      className={`group relative w-full text-left bg-white rounded-2xl border overflow-hidden transition-all duration-300 ${
        isExpanded
          ? "border-gray-300 shadow-xl ring-1 ring-gray-200"
          : "border-gray-200 hover:border-gray-300 hover:shadow-lg"
      }`}
    >
      {/* Foto y contenido */}
      <div className="flex flex-col items-center pt-8 pb-5 px-5">
        {/* Foto circular */}
        <div className="relative w-28 h-28 mb-4">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-stone-300 to-stone-100 ring-4 ring-white shadow-lg" />
          <div className="relative w-full h-full rounded-full overflow-hidden ring-4 ring-white shadow-lg">
            {photoUrl ? (
              <Image
                src={photoUrl}
                alt={name}
                fill
                sizes="112px"
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-stone-200 to-stone-100 flex items-center justify-center">
                <UserCircle className="w-14 h-14 text-stone-400" />
              </div>
            )}
          </div>
        </div>

        {/* Nombre y rol */}
        <h3 className="text-lg font-bold text-gray-900 text-center">{name}</h3>
        <p className="text-sm font-medium text-stone-500 mt-0.5">{role}</p>

        {/* Bio extracto */}
        {bio && (
          <p className="text-xs text-gray-500 mt-2 leading-relaxed line-clamp-2 text-center max-w-[220px]">
            {bio}
          </p>
        )}

        {/* Badges de servicios y galería */}
        <div className="flex items-center gap-3 mt-4">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-50 border border-gray-100">
            <Scissors className="w-3 h-3 text-gray-400" />
            <span className="text-xs font-medium text-gray-600">
              {servicesCount} {servicesCount === 1 ? "servicio" : "servicios"}
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-50 border border-gray-100">
            <ImageIcon className="w-3 h-3 text-gray-400" />
            <span className="text-xs font-medium text-gray-600">
              {galleryCount} {galleryCount === 1 ? "trabajo" : "trabajos"}
            </span>
          </div>
        </div>

        {/* Indicador de expansión */}
        <div className="mt-4 flex items-center gap-1 text-xs text-gray-400 group-hover:text-gray-600 transition-colors">
          <span>{isExpanded ? "Cerrar perfil" : "Ver perfil"}</span>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </motion.div>
        </div>
      </div>
    </motion.button>
  )
}
