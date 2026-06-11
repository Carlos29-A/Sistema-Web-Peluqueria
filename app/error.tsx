"use client"

import { useEffect } from "react"
import Link from "next/link"
import { TriangleAlert, ArrowLeft, MessageCircle } from "lucide-react"
import * as Sentry from "@sentry/nextjs"

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    Sentry.captureException(error)
    console.error("[ErrorBoundary]", error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-white to-orange-50 p-4">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-200/50 mb-8 animate-bounce">
          <TriangleAlert className="w-10 h-10 text-white" />
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          Algo salió mal
        </h1>
        <p className="text-gray-600 mb-8 leading-relaxed">
          Ocurrió un error inesperado. Por favor, intenta de nuevo.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-gray-900 hover:bg-gray-800 rounded-xl transition-all shadow-md hover:shadow-lg"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio
          </Link>
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-amber-700 bg-amber-100 hover:bg-amber-200 rounded-xl transition-all"
          >
            Intentar de nuevo
          </button>
        </div>

        <div className="pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-3">¿Necesitas ayuda?</p>
          <a
            href="https://wa.me/51999888777?text=Hola%2C%20tengo%20un%20problema%20con%20la%20web"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            Contáctanos por WhatsApp
          </a>
        </div>

        {process.env.NODE_ENV === "development" && error.digest && (
          <p className="mt-6 text-xs text-gray-400 font-mono">
            Error digest: {error.digest}
          </p>
        )}
      </div>
    </div>
  )
}
