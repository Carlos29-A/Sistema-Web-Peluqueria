import Link from "next/link"
import { Sparkles, Scissors, ArrowLeft, MessageCircle } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 via-white to-amber-50/30 p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-amber-200/20 blur-3xl" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-orange-200/20 blur-3xl" />

      <div className="relative max-w-lg w-full text-center">
        {/* 404 */}
        <div className="relative mb-6">
          <div className="text-[10rem] sm:text-[12rem] font-black leading-none bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 bg-clip-text text-transparent select-none tracking-tighter">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center mt-12 sm:mt-16">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-xl shadow-amber-200/50 rotate-12 hover:rotate-0 transition-transform duration-500">
              <Scissors className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <h1 className="text-2xl font-bold text-gray-900">
            ¡Ups! Página no encontrada
          </h1>
        </div>

        {/* Description */}
        <p className="text-gray-600 mb-10 leading-relaxed max-w-sm mx-auto">
          La página que buscas no existe o fue movida. 
          Te invitamos a explorar nuestros servicios o volver al inicio.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-gray-900 hover:bg-gray-800 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio
          </Link>
          <Link
            href="/servicios"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl transition-all duration-200"
          >
            <Scissors className="w-4 h-4" />
            Ver servicios
          </Link>
        </div>

        {/* Contact */}
        <div className="pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-3">¿Necesitas ayuda?</p>
          <a
            href="https://wa.me/51999888777?text=Hola%2C%20estoy%20en%20una%20p%C3%A1gina%20que%20no%20existe%20y%20necesito%20ayuda"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            Contáctanos por WhatsApp
          </a>
        </div>
      </div>
    </div>
  )
}
