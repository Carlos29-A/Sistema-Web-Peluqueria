import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import PublicHeader from "@/components/public/layout/PublicHeader"
import PublicFooter from "@/components/public/layout/PublicFooter"
import WhatsAppButton from "@/components/public/layout/WhatsAppButton"

async function getBusinessConfig(): Promise<Record<string, string>> {
  const entries = await prisma.businessConfig.findMany()
  const config: Record<string, string> = {}
  for (const entry of entries) {
    config[entry.key] = entry.value
  }
  return config
}

export async function generateMetadata(): Promise<Metadata> {
  const config = await getBusinessConfig()
  const businessName = config.business_name ?? "GlamStudio"
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"

  return {
    title: {
      default: `${businessName} - Peluquería & Estilismo Profesional`,
      template: `%s - ${businessName}`,
    },
    description:
      config.business_description ??
      "Tu salón de belleza y peluquería de confianza. Cortes, coloración, tratamientos capilares y más. Reserva tu cita online.",
    openGraph: {
      siteName: businessName,
      url: siteUrl,
    },
  }
}

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const config = await getBusinessConfig()

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PublicHeader businessName={config.business_name ?? "GlamStudio"} />
      <main className="flex-1">{children}</main>
      <PublicFooter config={config} />
      <WhatsAppButton phone={config.whatsapp ?? ""} businessName={config.business_name} />
    </div>
  )
}
