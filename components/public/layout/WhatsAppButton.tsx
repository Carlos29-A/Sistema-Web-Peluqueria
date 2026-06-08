"use client"

import { useState, useEffect } from "react"
import { MessageCircle } from "lucide-react"

interface WhatsAppButtonProps {
  phone: string
  message?: string
  businessName?: string
}

export default function WhatsAppButton({ phone, message, businessName }: WhatsAppButtonProps) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    function onScroll() {
      setShow(window.scrollY > 400)
    }
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  if (!phone) return null

  const brand = businessName ?? "GlamStudio"
  const text = encodeURIComponent(
    message ?? `Hola ${brand}, me gustaría agendar una cita`
  )
  const url = `https://wa.me/${phone.replace(/\D/g, "")}?text=${text}`

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-300 ${
        show ? "scale-100 opacity-100" : "scale-0 opacity-0"
      }`}
    >
      <MessageCircle className="w-6 h-6" />
      <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-25" />
    </a>
  )
}
