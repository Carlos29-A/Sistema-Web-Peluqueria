"use client"

import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react"
import { InstagramIcon, FacebookIcon } from "../icons/SocialIcons"
import Container from "../ui/Container"

interface PublicFooterProps {
  config: Record<string, string>
}

export default function PublicFooter({ config }: PublicFooterProps) {
  const businessName = config.business_name ?? "GlamStudio"
  const phone = config.phone ?? ""
  const whatsapp = config.whatsapp ?? ""
  const address = config.address ?? ""
  const instagram = config.instagram ?? ""
  const facebook = config.facebook ?? ""
  const email = config.email ?? ""
  const hours = config.opening_hours ?? ""
  const instagramUrl = instagram
    ? `https://instagram.com/${instagram.replace("@", "")}`
    : "#"
  const facebookUrl = facebook ? `https://facebook.com/${facebook}` : "#"
  const whatsappUrl = whatsapp
    ? `https://wa.me/${whatsapp.replace(/\D/g, "")}?text=Hola%20${encodeURIComponent(
        businessName
      )}%2C%20me%20gustar%C3%ADa%20agendar%20una%20cita`
    : "#"

  return (
    <footer className="bg-gray-900 text-gray-300">
      <Container>
        <div className="py-12 lg:py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">
              {businessName.split(" ")[0]}
              <span className="text-amber-500">Studio</span>
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Tu peluquería de confianza. Estilo, color y cuidado profesional para tu cabello.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Contacto
            </h4>
            <ul className="space-y-3 text-sm">
              {address && (
                <li className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-amber-500" />
                  <span className="text-gray-400">{address}</span>
                </li>
              )}
              {phone && (
                <li className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 shrink-0 text-amber-500" />
                  <a href={`tel:${phone}`} className="text-gray-400 hover:text-amber-500 transition-colors">
                    {phone}
                  </a>
                </li>
              )}
              {email && (
                <li className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 shrink-0 text-amber-500" />
                  <a href={`mailto:${email}`} className="text-gray-400 hover:text-amber-500 transition-colors">
                    {email}
                  </a>
                </li>
              )}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Horarios
            </h4>
            {hours ? (
              <div className="flex items-start gap-2.5 text-sm text-gray-400">
                <Clock className="w-4 h-4 mt-0.5 shrink-0 text-amber-500" />
                <span className="leading-relaxed">{hours}</span>
              </div>
            ) : (
              <p className="text-sm text-gray-500">Próximamente</p>
            )}
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Síguenos
            </h4>
            <div className="flex gap-3">
              {instagram && (
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gradient-to-br hover:from-pink-500 hover:to-amber-500 flex items-center justify-center transition-all"
                  aria-label="Instagram"
                >
                  <InstagramIcon className="w-4 h-4 text-white" />
                </a>
              )}
              {facebook && (
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gray-800 hover:bg-blue-600 flex items-center justify-center transition-colors"
                  aria-label="Facebook"
                >
                  <FacebookIcon className="w-4 h-4 text-white" />
                </a>
              )}
              {whatsapp && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gray-800 hover:bg-emerald-600 flex items-center justify-center transition-colors"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="w-4 h-4 text-white" />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} {businessName}. Todos los derechos reservados.
          </p>
          <p>
            Hecho con <span className="text-amber-500">♥</span> para tu belleza
          </p>
        </div>
      </Container>
    </footer>
  )
}
