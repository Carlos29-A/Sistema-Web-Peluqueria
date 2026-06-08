"use client"

import { useState } from "react"
import { motion, AnimatePresence, LayoutGroup } from "framer-motion"
import { UserCircle } from "lucide-react"
import Container from "@/components/public/ui/Container"
import SectionHeader from "@/components/public/ui/SectionHeader"
import StaffCatalogCard from "@/components/public/cards/StaffCatalogCard"
import StaffProfileExpanded from "@/components/public/cards/StaffProfileExpanded"
import type { CatalogStaff } from "@/app/(public)/equipo/page"

interface StaffCatalogProps {
  staff: CatalogStaff[]
}

export default function StaffCatalog({ staff }: StaffCatalogProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const expandedStaff = staff.find((s) => s.id === expandedId) ?? null

  function handleToggle(id: string) {
    setExpandedId((prev) => (prev === id ? null : id))
  }

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-white via-gray-50/50 to-white">
      <Container>
        <SectionHeader
          eyebrow="Nuestro equipo"
          title="Profesionales que aman lo que hacen"
          subtitle="Conoce a nuestras estilistas, descubre sus especialidades y mira su galería de trabajos. Elige tu favorita y reserva tu cita."
        />

        <LayoutGroup>
          {/* Grid de cards */}
          <motion.div
            layout
            transition={{
              layout: { type: "spring", stiffness: 300, damping: 30 },
            }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          >
            <AnimatePresence mode="popLayout">
              {staff.map((member) => (
                <StaffCatalogCard
                  key={member.id}
                  name={member.name}
                  role={member.role}
                  bio={member.bio}
                  photoUrl={member.photoUrl}
                  servicesCount={member.services.length}
                  galleryCount={member.gallery.length}
                  isExpanded={expandedId === member.id}
                  onClick={() => handleToggle(member.id)}
                />
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Perfil expandido */}
          <AnimatePresence mode="wait">
            {expandedStaff && (
              <motion.div
                key={expandedStaff.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                className="mt-8"
              >
                <StaffProfileExpanded
                  staff={expandedStaff}
                  onClose={() => setExpandedId(null)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </LayoutGroup>

        {/* Estado vacío */}
        {staff.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <UserCircle className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No hay estilistas disponibles
            </h3>
            <p className="text-gray-500">
              Pronto conocerás a nuestro equipo de profesionales.
            </p>
          </div>
        )}
      </Container>
    </section>
  )
}
