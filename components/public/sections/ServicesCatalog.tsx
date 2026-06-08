"use client"

import { useMemo, useState } from "react"
import { motion, AnimatePresence, LayoutGroup } from "framer-motion"
import { Filter, Sparkles } from "lucide-react"
import Container from "@/components/public/ui/Container"
import SectionHeader from "@/components/public/ui/SectionHeader"
import ServiceCatalogCard from "@/components/public/cards/ServiceCatalogCard"
import type { CatalogService } from "@/app/(public)/servicios/page"

interface ServicesCatalogProps {
  services: CatalogService[]
}

export default function ServicesCatalog({ services }: ServicesCatalogProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const categories = useMemo(() => {
    const cats = services
      .map((s) => s.category)
      .filter((c): c is string => Boolean(c))
    return [...new Set(cats)]
  }, [services])

  const filteredServices = useMemo(() => {
    if (!selectedCategory) return services
    return services.filter((s) => s.category === selectedCategory)
  }, [services, selectedCategory])

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-white via-gray-50/50 to-white">
      <Container>
        <SectionHeader
          eyebrow="Catálogo completo"
          title="Servicios diseñados para ti"
          subtitle="Explora todos nuestros servicios, filtra por categoría y reserva tu cita de forma rápida y sencilla."
        />

        {/* Filtros de categoría */}
        <div className="flex flex-col items-center gap-4 mb-12">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Filter className="w-4 h-4" />
            <span>Filtrar por categoría</span>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedCategory === null
                  ? "bg-amber-500 text-white shadow-md shadow-amber-200"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-amber-300 hover:text-amber-600"
              }`}
            >
              Todos
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedCategory === cat
                    ? "bg-amber-500 text-white shadow-md shadow-amber-200"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-amber-300 hover:text-amber-600"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Contador de resultados */}
          <p className="text-sm text-gray-500">
            {filteredServices.length}{" "}
            {filteredServices.length === 1 ? "servicio" : "servicios"}{" "}
            {selectedCategory ? `en ${selectedCategory}` : "disponibles"}
          </p>
        </div>

        {/* Grid de servicios */}
        <LayoutGroup>
          <motion.div
            layout
            transition={{ layout: { type: "spring", stiffness: 350, damping: 32 } }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 min-h-[200px]"
          >
            <AnimatePresence mode="popLayout" initial={false}>
              {filteredServices.length > 0 ? (
                filteredServices.map((service) => (
                  <ServiceCatalogCard key={service.id} {...service} />
                ))
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="col-span-full flex flex-col items-center justify-center py-20 text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <Sparkles className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No se encontraron servicios
                  </h3>
                  <p className="text-gray-500 max-w-sm">
                    No hay servicios disponibles en la categoría seleccionada. Intenta con otra categoría.
                  </p>
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className="mt-4 px-5 py-2.5 text-sm font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-full transition-colors"
                  >
                    Ver todos los servicios
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </LayoutGroup>
      </Container>
    </section>
  )
}
