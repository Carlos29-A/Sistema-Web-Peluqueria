import type { Metadata } from "next"
import type { CatalogService } from "@/types"
import { prisma } from "@/lib/prisma"
import ServicesCatalog from "@/components/public/sections/ServicesCatalog"

export const metadata: Metadata = {
  title: "Servicios - GlamStudio",
  description:
    "Explora nuestro catálogo completo de servicios: cortes, color, tratamientos, peinados y más. Conocé los precios y reservá tu cita.",
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

async function getCurrency(): Promise<string> {
  const entry = await prisma.businessConfig.findUnique({ where: { key: "currency" } })
  return entry?.value ?? "USD"
}

export default async function ServiciosPage() {
  const [services, currency] = await Promise.all([getServices(), getCurrency()])

  return <ServicesCatalog services={services} currency={currency} />
}
