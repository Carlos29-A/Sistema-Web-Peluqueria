import { Users } from "lucide-react"
import type { LandingStaff } from "@/types"
import Container from "../ui/Container"
import SectionHeader from "../ui/SectionHeader"
import StaffCard from "../cards/StaffCard"

interface StaffSectionProps {
  staff: LandingStaff[]
}

export default function StaffSection({ staff }: StaffSectionProps) {
  if (staff.length === 0) {
    return (
      <section id="staff" className="py-20 lg:py-28 bg-white">
        <Container>
          <SectionHeader
            eyebrow="Nuestro equipo"
            title="Profesionales que aman lo que hacen"
            subtitle="Conoce a las estilistas que harán realidad el look que siempre has soñado."
          />
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 mb-4">
              <Users className="w-8 h-8 text-amber-500" />
            </div>
            <p className="text-gray-500 text-lg">Próximamente conocerás a nuestro equipo.</p>
          </div>
        </Container>
      </section>
    )
  }

  return (
    <section id="staff" className="py-20 lg:py-28 bg-white">
      <Container>
        <SectionHeader
          eyebrow="Nuestro equipo"
          title="Profesionales que aman lo que hacen"
          subtitle="Conoce a las estilistas que harán realidad el look que siempre has soñado."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {staff.slice(0, 8).map((member) => (
            <StaffCard key={member.id} {...member} />
          ))}
        </div>
      </Container>
    </section>
  )
}
