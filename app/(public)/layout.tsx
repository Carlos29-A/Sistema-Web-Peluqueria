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
