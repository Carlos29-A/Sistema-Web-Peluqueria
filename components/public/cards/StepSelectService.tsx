"use client"

import { useMemo, useState } from "react"
import { motion, AnimatePresence, LayoutGroup } from "framer-motion"
import { Check, Clock, Filter, Sparkles } from "lucide-react"
import type { CatalogService } from "@/types"
import { SERVICE_CATEGORIES } from "@/lib/constants/landing"
import Container from "@/components/public/ui/Container"

interface StepSelectServiceProps {
  services: CatalogService[]
  defaultServiceId?: string
  onSelect: (serviceId: string) => void
  onNext: () => void
  onBack?: () => void
}

export default function StepSelectService({
  services,
  defaultServiceId,
  onSelect,
  onNext,
  onBack,
}: StepSelectServiceProps) {
  const [selectedId, setSelectedId] = useState<string | null>(defaultServiceId ?? null)
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null)

  const categories = useMemo(() => {
    const cats = services
      .map((s) => s.category)
      .filter((c): c is string => Boolean(c))
    return [...new Set(cats)]
  }, [services])

  const filteredServices = useMemo(() => {
    if (!categoryFilter) return services
    return services.filter((s) => s.category === categoryFilter)
  }, [services, categoryFilter])

  function handleSelect(id: string) {
    setSelectedId(id)
    onSelect(id)
  }

  return (
    <section className="py-12 sm:py-16">
      <Container>
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            ¿Qué servicio deseas?
          </h1>
          <p className="text-gray-600 max-w-lg mx-auto">
            Selecciona el tratamiento que necesitas y te mostraremos los horarios disponibles.
          </p>
        </div>

        {/* Filtros */}
        <div className="flex flex-col items-center gap-4 mb-10">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Filter className="w-4 h-4" />
            <span>Filtrar por categoría</span>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={() => setCategoryFilter(null)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                categoryFilter === null
                  ? "bg-gray-900 text-white shadow-md"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-gray-400"
              }`}
            >
              Todos
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  categoryFilter === cat
                    ? "bg-gray-900 text-white shadow-md"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-gray-400"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {filteredServices.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              No hay servicios disponibles
            </h3>
            <p className="text-gray-500 text-sm">
              No encontramos servicios en esta categoría.
            </p>
          </div>
        ) : (
          <LayoutGroup>
            <motion.div
              layout
              transition={{ layout: { type: "spring", stiffness: 350, damping: 32 } }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 min-h-[200px]"
            >
              <AnimatePresence mode="popLayout" initial={false}>
                {filteredServices.map((service) => (
                  <ServiceSelectCard
                    key={service.id}
                    service={service}
                    isSelected={selectedId === service.id}
                    onSelect={handleSelect}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          </LayoutGroup>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-10 pt-8 border-t border-gray-200">
          <div>
            {onBack && (
              <button
                onClick={onBack}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors inline-flex items-center gap-1"
              >
                ← Atrás
              </button>
            )}
          </div>
          <div className="text-sm text-gray-500">
            {selectedId ? "1 servicio seleccionado" : "Ningún servicio seleccionado"}
          </div>
          <button
            onClick={onNext}
            disabled={!selectedId}
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Siguiente →
          </button>
        </div>
      </Container>
    </section>
  )
}

function ServiceSelectCard({
  service,
  isSelected,
  onSelect,
}: {
  service: CatalogService
  isSelected: boolean
  onSelect: (id: string) => void
}) {
  const Icon =
    (service.category && SERVICE_CATEGORIES[service.category]) || SERVICE_CATEGORIES.default

  return (
    <motion.button
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      onClick={() => onSelect(service.id)}
      type="button"
      className={`relative w-full text-left bg-white rounded-2xl border-2 p-5 transition-all duration-200 hover:shadow-lg ${
        isSelected
          ? "border-amber-500 shadow-lg shadow-amber-100 ring-1 ring-amber-200"
          : "border-gray-100 hover:border-gray-300 hover:-translate-y-0.5"
      }`}
    >
      {/* Checkmark */}
      {isSelected && (
        <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-sm">
          <Check className="w-3.5 h-3.5 text-white" />
        </div>
      )}

      {/* Icon */}
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors ${
          isSelected
            ? "bg-gradient-to-br from-amber-100 to-orange-100"
            : "bg-gradient-to-br from-gray-50 to-gray-100"
        }`}
      >
        <Icon
          className={`w-6 h-6 transition-colors ${
            isSelected ? "text-amber-600" : "text-gray-400"
          }`}
        />
      </div>

      {/* Name & Description */}
      <h3
        className={`text-base font-bold mb-1 transition-colors ${
          isSelected ? "text-amber-700" : "text-gray-900"
        }`}
      >
        {service.name}
      </h3>
      {service.description && (
        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-4">
          {service.description}
        </p>
      )}

      {/* Category Badge */}
      {service.category && (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium mb-3 ${
            isSelected
              ? "bg-amber-50 text-amber-700"
              : "bg-gray-50 text-gray-600"
          }`}
        >
          <Icon className="w-3 h-3" />
          {service.category}
        </span>
      )}

      {/* Price & Duration */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <p className="text-lg font-bold text-gray-900">
          ${Number(service.price).toLocaleString("es-CL")}
        </p>
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Clock className="w-3.5 h-3.5" />
          {service.duration} min
        </div>
      </div>
    </motion.button>
  )
}
