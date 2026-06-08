"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { X, AlertCircle } from "lucide-react"
import { staffSchema, type StaffInput } from "@/lib/validations/staff"
import ImageUpload from "@/app/admin/servicios/components/ImageUpload"

interface StaffFormProps {
  mode: "create" | "edit"
  initialData?: {
    id: string
    name: string
    role: string
    bio: string | null
    photoUrl: string | null
    instagram: string | null
    isActive: boolean
  }
  onSuccess: () => void
  onClose: () => void
}

export default function StaffForm({
  mode,
  initialData,
  onSuccess,
  onClose,
}: StaffFormProps) {
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [photoUrl, setPhotoUrl] = useState<string | null>(initialData?.photoUrl ?? null)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<StaffInput>({
    resolver: zodResolver(staffSchema) as any,
    defaultValues: {
      name: initialData?.name ?? "",
      role: initialData?.role ?? "",
      bio: initialData?.bio ?? "",
      photoUrl: initialData?.photoUrl ?? "",
      instagram: initialData?.instagram ?? "",
      isActive: initialData?.isActive ?? true,
    },
  })

  async function onSubmit(data: StaffInput) {
    setSubmitting(true)
    setSubmitError(null)

    try {
      const url =
        mode === "edit" && initialData
          ? `/api/staff/${initialData.id}`
          : "/api/staff"
      const method = mode === "edit" ? "PUT" : "POST"

      const payload = {
        ...data,
        bio: data.bio || null,
        instagram: data.instagram || null,
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const body = await res.json()
        throw new Error(body.error || "Error al guardar")
      }

      toast.success(
        mode === "create" ? "Miembro del staff creado correctamente" : "Staff actualizado",
        { duration: 3000 }
      )
      onSuccess()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error inesperado"
      setSubmitError(msg)
      toast.error(msg, { duration: 3000 })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-xl border border-gray-200 w-full max-w-lg shadow-lg overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-gradient-to-r from-amber-50 to-orange-50">
          <h2 className="text-base font-bold text-gray-900">
            {mode === "create" ? "Nuevo miembro del staff" : "Editar miembro del staff"}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-white/60 rounded transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="px-5 py-5 space-y-4 overflow-y-auto">
          {submitError && (
            <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{submitError}</span>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre completo <span className="text-amber-500">*</span>
            </label>
            <input
              {...register("name")}
              type="text"
              placeholder="Ej: María García"
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 focus:outline-none text-sm transition"
            />
            {errors.name && (
              <p className="flex items-center gap-1 text-xs text-red-500 mt-1">
                <AlertCircle className="w-3 h-3" />
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rol <span className="text-amber-500">*</span>
            </label>
            <select
              {...register("role")}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 focus:outline-none text-sm transition bg-white"
            >
              <option value="">Seleccionar rol...</option>
              <option value="Estilista">Estilista</option>
              <option value="Colorista">Colorista</option>
              <option value="Barbero">Barbero</option>
              <option value="Maquillador">Maquillador</option>
              <option value="Recepcionista">Recepcionista</option>
            </select>
            {errors.role && (
              <p className="flex items-center gap-1 text-xs text-red-500 mt-1">
                <AlertCircle className="w-3 h-3" />
                {errors.role.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Biografía
            </label>
            <textarea
              {...register("bio")}
              rows={3}
              placeholder="Breve descripción del miembro del staff..."
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 focus:outline-none text-sm resize-none transition"
            />
            {errors.bio && (
              <p className="flex items-center gap-1 text-xs text-red-500 mt-1">
                <AlertCircle className="w-3 h-3" />
                {errors.bio.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Foto de perfil
            </label>
            <ImageUpload
              value={photoUrl}
              onChange={(url) => {
                setPhotoUrl(url)
                setValue("photoUrl", url)
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Instagram
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">@</span>
              <input
                {...register("instagram")}
                type="text"
                placeholder="usuario"
                className="w-full pl-7 pr-3 py-2 rounded-lg border border-gray-300 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 focus:outline-none text-sm transition"
              />
            </div>
            {errors.instagram && (
              <p className="flex items-center gap-1 text-xs text-red-500 mt-1">
                <AlertCircle className="w-3 h-3" />
                {errors.instagram.message}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              {...register("isActive")}
              type="checkbox"
              id="isActive"
              className="w-4 h-4 rounded border-gray-300 text-amber-500 focus:ring-amber-400"
            />
            <label htmlFor="isActive" className="text-sm text-gray-700">
              Activo
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg hover:from-amber-600 hover:to-orange-600 transition disabled:opacity-50 shadow-sm"
            >
              {submitting
                ? "Guardando..."
                : mode === "create"
                  ? "Crear miembro"
                  : "Guardar cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
