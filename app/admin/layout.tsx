"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { Toaster } from "sonner"
import {
  LayoutDashboard,
  CalendarDays,
  Scissors,
  Users,
  Image,
  Settings,
  Menu,
  X,
} from "lucide-react"

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/citas", label: "Citas", icon: CalendarDays },
  { href: "/admin/servicios", label: "Servicios", icon: Scissors },
  { href: "/admin/staff", label: "Staff", icon: Users },
  { href: "/admin/galeria", label: "Galería", icon: Image },
  { href: "/admin/configuracion", label: "Configuración", icon: Settings },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const isLoginPage = pathname === "/admin/login"

  if (isLoginPage) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-60 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="h-14 flex items-center justify-between px-5 border-b border-gray-200">
          <span className="text-base font-bold">GlamStudio</span>
          <button
            className="lg:hidden p-1"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${
                  isActive
                    ? "bg-gray-100 text-black font-medium"
                    : "text-gray-500 hover:text-black hover:bg-gray-50"
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-3 border-t border-gray-200">
          <button
            onClick={() => signOut({ redirectTo: "/admin/login" })}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 w-full transition"
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 flex items-center gap-3 px-4 lg:px-6 border-b border-gray-200 bg-white">
          <button
            className="lg:hidden p-1"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-sm font-medium">
            {navItems.find((item) =>
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href)
            )?.label ?? "Dashboard"}
          </h1>
        </header>

        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">{children}</main>
      </div>

      <Toaster position="top-right" richColors />
    </div>
  )
}
