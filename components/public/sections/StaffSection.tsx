import type { LandingStaff } from "@/types"
import Container from "../ui/Container"
import SectionHeader from "../ui/SectionHeader"
import StaffCard from "../cards/StaffCard"

interface StaffSectionProps {
  staff: LandingStaff[]
}

export default function StaffSection({ staff }: StaffSectionProps) {
  if (staff.length === 0) return null

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
