"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { LoginInput, loginSchema } from "@/lib/validations/auth"

export default function LoginPage() {
  const router = useRouter()
  const [authError, setAuthError] = useState<string | null>(null)

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
      setAuthError(result.code)
    } else {
      router.push("/admin")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-1">GlamStudio</h1>
        <p className="text-gray-500 text-center text-sm mb-8">Panel de administración</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white p-6 rounded-xl shadow-sm border border-gray-200" noValidate>
          <div>
            <input
              {...register("email")}
              type="email"
              placeholder="Correo electrónico"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-black focus:outline-none transition text-sm"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <input
              {...register("password")}
              type="password"
              placeholder="Contraseña"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-black focus:outline-none transition text-sm"
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          {authError && (
            <p className="text-red-500 text-xs text-center bg-red-50 border border-red-200 rounded-lg py-2">
              {authError}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 bg-black hover:bg-gray-800 text-white font-medium rounded-lg transition disabled:opacity-50 text-sm"
          >
            {isSubmitting ? "Entrando..." : "Ingresar"}
          </button>
        </form>
      </div>
    </div>
  )
}
