import Link from "next/link"
import { Calendar } from "lucide-react"
import Container from "../ui/Container"
import SectionHeader from "../ui/SectionHeader"
import ServiceCard from "../cards/ServiceCard"

interface Service {
  id: string
  name: string
  description: string | null
  price: number
  duration: number
  category: string | null
}

interface ServicesSectionProps {
  services: Service[]
}

export default function ServicesSection({ services }: ServicesSectionProps) {
  if (services.length === 0) return null

  return (
    <section id="servicios" className="py-20 lg:py-28 bg-white">
      <Container>
        <SectionHeader
          eyebrow="Nuestros servicios"
          title="Servicios diseñados para ti"
          subtitle="Cortes, color, tratamientos y peinados para cada ocasión. Trabajamos con productos de primera calidad y técnicas de vanguardia."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {services.slice(0, 6).map((service) => (
            <ServiceCard key={service.id} {...service} />
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/reservar"
            className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold text-white bg-gray-900 hover:bg-gray-800 rounded-full transition-colors shadow-sm"
          >
            <Calendar className="w-4 h-4" />
            Reservar un servicio
          </Link>
        </div>
      </Container>
    </section>
  )
}
