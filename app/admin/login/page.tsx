"use client"

import { useState } from "react"
import Link from "next/link"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { LoginInput, loginSchema } from "@/lib/validations/auth"
import {
  Scissors,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  Loader2,
  Sparkles,
} from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [authError, setAuthError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  })

  async function onSubmit(data: LoginInput) {
    setAuthError(null)
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    })
    if (result?.code) {
      setAuthError("Credenciales inválidas. Verifica tu email y contraseña.")
    } else {
      router.push("/admin")
    }
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-stone-900">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 rounded-full bg-amber-500/10 blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-orange-500/10 blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center w-full px-12">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-2xl shadow-amber-500/25 mb-8">
            <Scissors className="w-10 h-10 text-white" />
          </div>

          <h1 className="text-4xl font-bold text-white mb-4 text-center">
            Glam<span className="text-amber-400">Studio</span>
          </h1>
          <p className="text-gray-400 text-center text-lg leading-relaxed max-w-sm">
            Tu panel de administración para gestionar citas, servicios y equipo
          </p>

          <div className="mt-12 flex items-center gap-6">
            <div className="text-center">
              <div className="flex items-center gap-1 text-amber-400 mb-1">
                <Sparkles className="w-4 h-4" />
                <Sparkles className="w-4 h-4" />
                <Sparkles className="w-4 h-4" />
              </div>
              <p className="text-xs text-gray-500">Gestión profesional</p>
            </div>
            <div className="w-px h-8 bg-gray-700" />
            <div className="text-center">
              <div className="flex items-center gap-1 text-amber-400 mb-1">
                <Sparkles className="w-4 h-4" />
                <Sparkles className="w-4 h-4" />
                <Sparkles className="w-4 h-4" />
              </div>
              <p className="text-xs text-gray-500">Control total</p>
            </div>
            <div className="w-px h-8 bg-gray-700" />
            <div className="text-center">
              <div className="flex items-center gap-1 text-amber-400 mb-1">
                <Sparkles className="w-4 h-4" />
                <Sparkles className="w-4 h-4" />
                <Sparkles className="w-4 h-4" />
              </div>
              <p className="text-xs text-gray-500">Fácil de usar</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile Branding */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-14 h-14 mx-auto rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-200/50 mb-4">
              <Scissors className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Glam<span className="text-amber-500">Studio</span>
            </h1>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Bienvenido de vuelta</h2>
            <p className="text-gray-500 text-sm">Ingresa tus credenciales para acceder al panel</p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xl shadow-gray-200/50 p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Correo electrónico
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    id="email"
                    {...register("email")}
                    type="email"
                    placeholder="admin@peluqueria.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 outline-none transition-all duration-200 text-sm"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    id="password"
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 outline-none transition-all duration-200 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Error Message */}
              {authError && (
                <div className="flex items-center gap-2 px-4 py-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {authError}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-amber-200/50 hover:shadow-xl hover:shadow-amber-300/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  <>
                    Ingresar
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors inline-flex items-center gap-1"
            >
              ← Volver al sitio web
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
