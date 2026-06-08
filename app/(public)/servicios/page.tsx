import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import ServicesCatalog from "@/components/public/sections/ServicesCatalog"

export const metadata: Metadata = {
  title: "Servicios - GlamStudio",
  description:
    "Explora nuestro catálogo completo de servicios: cortes, color, tratamientos, peinados y más. Conocé los precios y reservá tu cita.",
}

export interface CatalogService {
  id: string
  name: string
  description: string | null
  price: number
  duration: number
  category: string | null
  imageUrl: string | null
}

async function getServices(): Promise<CatalogService[]> {
  const services = await prisma.service.findMany({
    where: { isActive: true },
    orderBy: { category: "asc" },
  })

  return services.map((s) => ({
    id: s.id,
    name: s.name,
    description: s.description,
    price: Number(s.price),
    duration: s.duration,
    category: s.category,
    imageUrl: s.imageUrl,
  }))
}

export default async function ServiciosPage() {
  const services = await getServices()

  return <ServicesCatalog services={services} />
}
