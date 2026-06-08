import Container from "../ui/Container"
import SectionHeader from "../ui/SectionHeader"
import TestimonialCard from "../cards/TestimonialCard"
import { TESTIMONIALS } from "@/lib/constants/landing"

export default function TestimonialsSection() {
  return (
    <section id="testimonios" className="py-20 lg:py-28 bg-white">
      <Container>
        <SectionHeader
          eyebrow="Reseñas"
          title="Lo que dicen nuestras clientas"
          subtitle="La satisfacción de quienes confían en nosotras es nuestra mejor carta de presentación."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {TESTIMONIALS.map((testimonial) => (
            <TestimonialCard key={testimonial.id} {...testimonial} />
          ))}
        </div>
      </Container>
    </section>
  )
}
