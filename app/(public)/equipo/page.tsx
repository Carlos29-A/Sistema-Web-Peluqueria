import type { Metadata } from "next"
import type { CatalogStaff } from "@/types"
import { prisma } from "@/lib/prisma"
import StaffCatalog from "@/components/public/sections/StaffCatalog"

export const metadata: Metadata = {
  title: "Equipo - GlamStudio",
  description:
    "Conoce a nuestro equipo de estilistas profesionales. Descubre sus especialidades, mira su galería de trabajos y reserva tu cita con tu estilista favorita.",
}

async function getStaff(): Promise<CatalogStaff[]> {
  const staff = await prisma.staff.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "asc" },
    include: {
      staffServices: {
        include: {
          service: {
            select: { id: true, name: true, category: true },
          },
        },
      },
      gallery: {
        orderBy: { createdAt: "desc" },
      },
    },
  })

  return staff.map((s) => ({
    id: s.id,
    name: s.name,
    role: s.role,
    bio: s.bio,
    photoUrl: s.photoUrl,
    instagram: s.instagram,
    services: s.staffServices.map((ss) => ({
      id: ss.service.id,
      name: ss.service.name,
      category: ss.service.category,
    })),
    gallery: s.gallery.map((g) => ({
      id: g.id,
      imageUrl: g.imageUrl,
      description: g.description,
      category: g.category,
    })),
  }))
}

export default async function EquipoPage() {
  const staff = await getStaff()

  return <StaffCatalog staff={staff} />
}
