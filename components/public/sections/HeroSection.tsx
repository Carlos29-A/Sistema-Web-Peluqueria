"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Calendar, Sparkles } from "lucide-react"
import { InstagramIcon, FacebookIcon } from "../icons/SocialIcons"
import { HERO_IMAGE } from "@/lib/constants/landing"

interface HeroSectionProps {
  businessName: string
  instagram: string
  facebook: string
}

export default function HeroSection({ businessName, instagram, facebook }: HeroSectionProps) {
  const brandName = businessName.split(" ")[0] || "Glam"
  const lastName = businessName.split(" ")[1] || "Studio"
  const instagramUrl = instagram ? `https://instagram.com/${instagram.replace("@", "")}` : "#"
  const facebookUrl = facebook ? `https://facebook.com/${facebook}` : "#"

  return (
    <section className="relative h-[100svh] min-h-[600px] w-full overflow-hidden">
      <Image
        src={HERO_IMAGE}
        alt="GlamStudio - Peluquería profesional"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

      <div className="relative h-full flex items-center">
        <div className="mx-auto max-w-6xl w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs font-medium text-white uppercase tracking-wider">
                Peluquería & Estilismo
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-[1.05]"
            >
              {brandName}
              <br />
              <span className="text-amber-400">{lastName}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 text-lg sm:text-xl text-white/90 leading-relaxed max-w-lg"
            >
              Tu estilo, nuestra pasión. Donde cada corte cuenta una historia y cada cliente es una obra de arte.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 flex flex-wrap items-center gap-4"
            >
              <Link
                href="/reservar"
                className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold text-gray-900 bg-amber-400 hover:bg-amber-300 rounded-full transition-colors shadow-lg"
              >
                <Calendar className="w-4 h-4" />
                Reserva tu cita
              </Link>
              <a
                href="#servicios"
                className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold text-white border-2 border-white/30 hover:border-white hover:bg-white/10 rounded-full transition-colors backdrop-blur-sm"
              >
                Ver servicios
              </a>
            </motion.div>

            {(instagram || facebook) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="mt-12 flex items-center gap-3"
              >
                <span className="text-xs text-white/60 uppercase tracking-wider">Síguenos</span>
                <div className="flex gap-2">
                  {instagram && (
                    <a
                      href={instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/20 flex items-center justify-center transition-colors"
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
                      className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/20 flex items-center justify-center transition-colors"
                      aria-label="Facebook"
                    >
                      <FacebookIcon className="w-4 h-4 text-white" />
                    </a>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden sm:block">
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-6 h-10 rounded-full border-2 border-white/40 flex items-start justify-center p-1.5"
        >
          <div className="w-1 h-2 rounded-full bg-white/60" />
        </motion.div>
      </div>
    </section>
  )
}
