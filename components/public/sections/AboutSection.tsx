"use client"

import { useState } from "react"
import Image from "next/image"
import { Award, Heart, Sparkles, ImageIcon } from "lucide-react"
import Container from "../ui/Container"
import { ABOUT_IMAGE, FALLBACK_GRADIENT } from "@/lib/constants/landing"

export default function AboutSection() {
  const [aboutError, setAboutError] = useState(false)
  return (
    <section id="nosotros" className="py-20 lg:py-28 bg-gradient-to-b from-amber-50/40 to-white">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="order-2 lg:order-1">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-amber-600 mb-3">
              Sobre nosotros
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-6">
              Donde el estilo se encuentra con la pasión
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                En <span className="font-semibold text-gray-900">GlamStudio</span> creemos
                que cada persona es única y merece un look que refleje su personalidad.
                Desde nuestros inicios, nos hemos dedicado a realzar la belleza de
                nuestros clientes a través del arte de la peluquería.
              </p>
              <p>
                Nuestro equipo de estilistas profesionales se mantiene en constante
                formación para traer las últimas tendencias y técnicas a tu silla.
                Trabajamos con productos premium que cuidan tu cabello mientras
                transforman tu imagen.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto rounded-full bg-white shadow-sm flex items-center justify-center mb-2">
                  <Award className="w-5 h-5 text-amber-600" />
                </div>
                <p className="text-xs font-semibold text-gray-900">Calidad</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto rounded-full bg-white shadow-sm flex items-center justify-center mb-2">
                  <Heart className="w-5 h-5 text-amber-600" />
                </div>
                <p className="text-xs font-semibold text-gray-900">Pasión</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto rounded-full bg-white shadow-sm flex items-center justify-center mb-2">
                  <Sparkles className="w-5 h-5 text-amber-600" />
                </div>
                <p className="text-xs font-semibold text-gray-900">Estilo</p>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2 relative">
            <div className={`relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl ${aboutError ? FALLBACK_GRADIENT : ""}`}>
              {aboutError ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <ImageIcon className="w-20 h-20 text-amber-300/50" />
                </div>
              ) : (
                <Image
                  src={ABOUT_IMAGE}
                  alt="Interior del salón GlamStudio"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  onError={() => setAboutError(true)}
                />
              )}
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-5 max-w-[200px] hidden sm:block">
              <p className="text-3xl font-bold text-gray-900">8+</p>
              <p className="text-xs text-gray-600">Años de experiencia</p>
            </div>
            <div className="absolute -top-6 -right-6 bg-amber-400 rounded-2xl shadow-xl p-5 hidden sm:block">
              <p className="text-3xl font-bold text-white">+500</p>
              <p className="text-xs text-white/90">Clientes felices</p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
