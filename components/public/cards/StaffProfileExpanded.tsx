"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  X,
  AtSign,
  Calendar,
  Image as ImageIcon,
  Scissors,
  UserCircle,
} from "lucide-react"
import type { CatalogStaff } from "@/app/(public)/equipo/page"

interface StaffProfileExpandedProps {
  staff: CatalogStaff
  onClose: () => void
}

export default function StaffProfileExpanded({
  staff,
  onClose,
}: StaffProfileExpandedProps) {
  const [galleryCategory, setGalleryCategory] = useState<string | null>(null)

  const galleryCategories = useMemo(() => {
    const cats = staff.gallery
      .map((g) => g.category)
      .filter((c): c is string => Boolean(c))
    return [...new Set(cats)]
  }, [staff.gallery])

  const filteredGallery = useMemo(() => {
    if (!galleryCategory) return staff.gallery
    return staff.gallery.filter((g) => g.category === galleryCategory)
  }, [staff.gallery, galleryCategory])

  return (
    <motion.div
      layout
      initial={{ opacity: 0, height: 0, scale: 0.97 }}
      animate={{ opacity: 1, height: "auto", scale: 1 }}
      exit={{ opacity: 0, height: 0, scale: 0.97 }}
      transition={{
        duration: 0.35,
        ease: [0.4, 0, 0.2, 1],
        layout: { type: "spring", stiffness: 300, damping: 30 },
      }}
      className="overflow-hidden"
    >
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
        {/* Header del perfil */}
        <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-stone-800 px-6 sm:px-8 pt-8 pb-12">
          {/* Botón cerrar */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all"
            aria-label="Cerrar perfil"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6">
            {/* Foto grande */}
            <div className="relative w-32 h-32 sm:w-36 sm:h-36 shrink-0">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-stone-400 to-stone-200 ring-4 ring-white/20 shadow-xl" />
              <div className="relative w-full h-full rounded-2xl overflow-hidden ring-4 ring-white/20 shadow-xl">
                {staff.photoUrl ? (
                  <Image
                    src={staff.photoUrl}
                    alt={staff.name}
                    fill
                    sizes="144px"
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-stone-300 to-stone-200 flex items-center justify-center">
                    <UserCircle className="w-16 h-16 text-stone-400" />
                  </div>
                )}
              </div>
            </div>

            {/* Info básica */}
            <div className="text-center sm:text-left flex-1">
              <h2 className="text-2xl font-bold text-white">{staff.name}</h2>
              <p className="text-stone-300 font-medium mt-0.5">{staff.role}</p>

              {staff.bio && (
                <p className="text-stone-400 text-sm mt-2 leading-relaxed max-w-lg">
                  {staff.bio}
                </p>
              )}

              {staff.instagram && (
                <a
                  href={`https://instagram.com/${staff.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 mt-3 text-sm text-stone-300 hover:text-white transition-colors"
                >
                  <AtSign className="w-4 h-4" />
                  {staff.instagram}
                </a>
              )}
            </div>

            {/* CTA Reservar */}
            <Link
              href={`/reservar?staff=${staff.id}`}
              className="shrink-0 inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-gray-900 bg-white hover:bg-gray-100 rounded-xl transition-all shadow-lg hover:shadow-xl"
            >
              <Calendar className="w-4 h-4" />
              Reservar con {staff.name.split(" ")[0]}
            </Link>
          </div>
        </div>

        {/* Contenido del perfil */}
        <div className="px-6 sm:px-8 py-6 space-y-8">
          {/* Servicios */}
          {staff.services.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Scissors className="w-4 h-4 text-gray-400" />
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                  Servicios
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {staff.services.map((service) => (
                  <span
                    key={service.id}
                    className="inline-flex items-center px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200 text-sm font-medium text-gray-700"
                  >
                    {service.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Galería */}
          {staff.gallery.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <ImageIcon className="w-4 h-4 text-gray-400" />
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                  Galería de trabajos
                </h3>
              </div>

              {/* Filtros de galería */}
              {galleryCategories.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  <button
                    onClick={() => setGalleryCategory(null)}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                      galleryCategory === null
                        ? "bg-gray-900 text-white"
                        : "bg-gray-50 text-gray-600 border border-gray-200 hover:border-gray-300 hover:text-gray-900"
                    }`}
                  >
                    Todos
                  </button>
                  {galleryCategories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setGalleryCategory(cat)}
                      className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                        galleryCategory === cat
                          ? "bg-gray-900 text-white"
                          : "bg-gray-50 text-gray-600 border border-gray-200 hover:border-gray-300 hover:text-gray-900"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}

              {/* Grid de galería */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                <AnimatePresence mode="popLayout">
                  {filteredGallery.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                      className="relative aspect-square rounded-xl overflow-hidden bg-stone-100 group"
                    >
                      <Image
                        src={item.imageUrl}
                        alt={item.description ?? "Trabajo"}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      {item.description && (
                        <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <p className="text-white text-xs line-clamp-2">
                            {item.description}
                          </p>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {filteredGallery.length === 0 && (
                <div className="py-8 text-center text-gray-400 text-sm">
                  No hay trabajos en esta categoría
                </div>
              )}
            </div>
          )}

          {/* CTA final */}
          <div className="pt-4 border-t border-gray-100">
            <Link
              href={`/reservar?staff=${staff.id}`}
              className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3.5 text-sm font-semibold text-white bg-gray-900 hover:bg-gray-800 rounded-xl transition-all shadow-md hover:shadow-lg"
            >
              <Calendar className="w-4 h-4" />
              Reservar cita con {staff.name.split(" ")[0]}
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
