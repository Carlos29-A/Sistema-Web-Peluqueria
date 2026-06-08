import Link from "next/link"
import { Calendar, ArrowLeft } from "lucide-react"
import Container from "@/components/public/ui/Container"

export default function ReservarPage() {
  return (
    <section className="min-h-[80vh] flex items-center bg-gradient-to-b from-amber-50/40 to-white">
      <Container>
        <div className="max-w-2xl mx-auto text-center py-20">
          <div className="w-16 h-16 mx-auto rounded-full bg-amber-100 flex items-center justify-center mb-6">
            <Calendar className="w-8 h-8 text-amber-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Reservar tu cita
          </h1>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Estamos trabajando en nuestro sistema de reservas en línea. Por ahora,
            contáctanos directamente por WhatsApp o teléfono para agendar tu cita.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-gray-900 border-2 border-gray-900 hover:bg-gray-900 hover:text-white rounded-full transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio
          </Link>
        </div>
      </Container>
    </section>
  )
}
