// prisma/seed.ts
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

async function main() {
  // ── Crear usuario admin ──────────────────────────
  const hashedPassword = await bcrypt.hash("admin123", 12)
  await prisma.user.upsert({
    where: { email: "admin@peluqueria.com" },
    update: {},
    create: {
      email:    "admin@peluqueria.com",
      name:     "Administrador",
      password: hashedPassword,
      role:     "admin",
    },
  })

  // ── Servicios ────────────────────────────────────
  await prisma.service.createMany({
    skipDuplicates: true,
    data: [
      { name: "Corte de Cabello",      price: 25,  duration: 45,  category: "Corte" },
      { name: "Tinte Completo",        price: 80,  duration: 120, category: "Color" },
      { name: "Mechas",                price: 100, duration: 150, category: "Color" },
      { name: "Keratina",              price: 120, duration: 90,  category: "Tratamiento" },
      { name: "Lavado + Secado",       price: 20,  duration: 30,  category: "Tratamiento" },
      { name: "Corte + Barba",         price: 35,  duration: 60,  category: "Corte" },
    ],
  })

  // ── Estilistas ───────────────────────────────────
  const maria = await prisma.staff.create({
    data: {
        name:  "María García",
        role:  "Estilista Senior",
        bio:   "Especialista en color y tratamientos capilares con 8 años de experiencia.",
    }
  })

  // ── Horarios lunes a viernes ─────────────────────
  await prisma.schedule.createMany({
    skipDuplicates: true,
    data: [0, 1, 2, 3, 4].map((day) => ({
      staffId:    maria.id,
      dayOfWeek:  day,
      startTime:  "09:00",
      endTime:    "18:00",
    })),
  })

  // ── Configuración del negocio ────────────────────
  const config = [
    { key: "business_name",   value: "Peluquería Bella" },
    { key: "phone",           value: "+51 999 888 777" },
    { key: "whatsapp",        value: "+51999888777" },
    { key: "address",         value: "Av. Principal 123, Lima" },
    { key: "instagram",       value: "@peluqueriabella" },
    { key: "opening_hours",   value: "Lunes a Sábado: 9am - 6pm" },
  ]

  for (const item of config) {
    await prisma.businessConfig.upsert({
      where:  { key: item.key },
      update: { value: item.value },
      create: item,
    })
  }

  console.log("✅ Seed completado — admin y datos base creados")
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
