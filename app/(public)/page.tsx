import { prisma } from "@/lib/prisma"
import HeroSection from "@/components/public/sections/HeroSection"
import ServicesSection from "@/components/public/sections/ServicesSection"
import AboutSection from "@/components/public/sections/AboutSection"
import StaffSection from "@/components/public/sections/StaffSection"
import GallerySection from "@/components/public/sections/GallerySection"
import TestimonialsSection from "@/components/public/sections/TestimonialsSection"

async function getLandingData() {
  const [services, staff, gallery, configEntries] = await Promise.all([
    prisma.service.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "asc" },
    }),
    prisma.staff.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "asc" },
    }),
    prisma.gallery.findMany({
      where: { isFeatured: true },
      orderBy: { createdAt: "desc" },
      include: { staff: { select: { name: true } } },
    }),
    prisma.businessConfig.findMany(),
  ])

  const config: Record<string, string> = {}
  for (const entry of configEntries) {
    config[entry.key] = entry.value
  }

  const serializedServices = services.map((s) => ({
    id: s.id,
    name: s.name,
    description: s.description,
    price: Number(s.price),
    duration: s.duration,
    category: s.category,
  }))

  return { services: serializedServices, staff, gallery, config }
}

export default async function HomePage() {
  const { services, staff, gallery, config } = await getLandingData()

  return (
    <>
      <HeroSection
        businessName={config.business_name ?? "GlamStudio"}
        instagram={config.instagram ?? ""}
        facebook={config.facebook ?? ""}
      />
      <ServicesSection services={services} currency={config.currency ?? "USD"} />
      <AboutSection />
      <StaffSection staff={staff} />
      <GallerySection items={gallery} />
      <TestimonialsSection />
    </>
  )
}
