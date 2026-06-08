"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Calendar, Sparkles, Users } from "lucide-react"

const navLinks = [
  { href: "/#servicios", label: "Servicios" },
  { href: "/#nosotros", label: "Nosotros" },
  { href: "/#staff", label: "Equipo" },
  { href: "/#galeria", label: "Galería" },
  { href: "/#testimonios", label: "Reseñas" },
]

export default function PublicHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const isLanding = pathname === "/"
  const scrolledStyle =
    isLanding && !scrolled
      ? "bg-transparent"
      : "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100"
  const textColor =
    isLanding && !scrolled ? "text-white" : "text-gray-900"
  const navTextColor =
    isLanding && !scrolled ? "text-white/90" : "text-gray-700"

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${scrolledStyle}`}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className={`text-xl font-bold tracking-tight transition-colors ${textColor}`}
          >
            Glam<span className="text-amber-500">Studio</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            <Link
              href="/servicios"
              className={`text-sm font-medium transition-colors hover:text-amber-500 ${
                pathname === "/servicios" ? "text-amber-600" : navTextColor
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Catálogo
              </span>
            </Link>
            <Link
              href="/equipo"
              className={`text-sm font-medium transition-colors hover:text-amber-500 ${
                pathname === "/equipo" ? "text-amber-600" : navTextColor
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                Equipo
              </span>
            </Link>
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-amber-500 ${navTextColor}`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden lg:block">
            <Link
              href="/reservar"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-amber-500 hover:bg-amber-600 rounded-full transition-colors shadow-sm"
            >
              <Calendar className="w-4 h-4" />
              Reservar
            </Link>
          </div>

          <button
            onClick={() => setOpen(!open)}
            className={`lg:hidden p-2 rounded-md transition-colors ${
              isLanding && !scrolled
                ? "text-white hover:bg-white/10"
                : "text-gray-900 hover:bg-gray-100"
            }`}
            aria-label="Menú"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg">
          <nav className="px-4 py-4 space-y-1">
            <Link
              href="/servicios"
              onClick={() => setOpen(false)}
              className={`flex items-center gap-2 px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${
                pathname === "/servicios"
                  ? "bg-amber-50 text-amber-700"
                  : "text-gray-700 hover:bg-gray-50 hover:text-amber-600"
              }`}
            >
              <Sparkles className="w-4 h-4" />
              Catálogo de servicios
            </Link>
            <Link
              href="/equipo"
              onClick={() => setOpen(false)}
              className={`flex items-center gap-2 px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${
                pathname === "/equipo"
                  ? "bg-amber-50 text-amber-700"
                  : "text-gray-700 hover:bg-gray-50 hover:text-amber-600"
              }`}
            >
              <Users className="w-4 h-4" />
              Nuestro equipo
            </Link>
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="block px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-amber-600 rounded-md transition-colors"
              >
                {link.label}
              </a>
            ))}
            <Link
              href="/reservar"
              onClick={() => setOpen(false)}
              className="mt-3 flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-semibold text-white bg-amber-500 hover:bg-amber-600 rounded-md transition-colors"
            >
              <Calendar className="w-4 h-4" />
              Reservar cita
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
