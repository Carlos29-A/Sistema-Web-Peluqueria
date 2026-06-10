"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { serviceSchema, ServiceInput } from "@/lib/validations/service"
import { X } from "lucide-react"
import ImageUpload from "./ImageUpload"
import { ApiError, apiFetch } from "@/lib/api-client"

interface ServiceFormProps {
  mode: "create" | "edit"
  initialData?: {
    id: string
    name: string
    description: string | null
    price: number
    duration: number
    category: string | null
    imageUrl: string | null
    isActive: boolean
  }
  onSuccess: () => void
  onClose: () => void
}

export default function ServiceForm({
  mode,
  initialData,
  onSuccess,
  onClose,
}: ServiceFormProps) {
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(initialData?.imageUrl ?? null)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ServiceInput>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      description: initialData?.description ?? "",
      price: initialData ? Number(initialData.price) : undefined,
      duration: initialData?.duration ?? undefined,
      category: initialData?.category ?? "",
      imageUrl: initialData?.imageUrl ?? "",
      isActive: initialData?.isActive ?? true,
    },
  })

  async function onSubmit(data: ServiceInput) {
    setSubmitting(true)
    setSubmitError(null)

    try {
      const url =
        mode === "edit" && initialData
          ? `/api/services/${initialData.id}`
          : "/api/services"
      const method = mode === "edit" ? "PUT" : "POST"

      await apiFetch(url, {
        method,
        body: JSON.stringify(data),
      })
      toast.success(
        mode === "create" ? "Servicio creado correctamente" : "Servicio actualizado",
        { duration: 3000 }
      )
      onSuccess()
    } catch (err: unknown) {
      const msg = err instanceof ApiError ? err.message : "Error inesperado"
      setSubmitError(msg)
      toast.error(msg, { duration: 3000 })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/40"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-xl border border-gray-200 w-full max-w-lg shadow-lg overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-linear-to-r from-violet-50 to-purple-50">
          <h2 className="text-base font-bold text-gray-900">
            {mode === "create" ? "Nuevo servicio" : "Editar servicio"}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-white/60 rounded transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="px-5 py-5 space-y-4 overflow-y-auto">
          {submitError && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {submitError}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Nombre <span className="text-violet-500">*</span>
            </label>
            <input
              {...register("name")}
              type="text"
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 focus:outline-none text-sm transition"
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Precio ($) <span className="text-violet-500">*</span>
              </label>
              <input
                {...register("price", {
                  setValueAs: (v) => (v === "" || v === undefined ? undefined : Number(v)),
                  required: "El precio es obligatorio",
                })}
                type="number"
                step="0.01"
                min="0"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 focus:outline-none text-sm transition"
              />
              {errors.price && (
                <p className="text-xs text-red-500 mt-1">{errors.price.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Duración (min) <span className="text-violet-500">*</span>
              </label>
              <input
                {...register("duration", {
                  setValueAs: (v) => (v === "" || v === undefined ? undefined : Number(v)),
                  required: "La duración es obligatoria",
                })}
                type="number"
                min="1"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 focus:outline-none text-sm transition"
              />
              {errors.duration && (
                <p className="text-xs text-red-500 mt-1">{errors.duration.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Categoría
            </label>
            <input
              {...register("category")}
              type="text"
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 focus:outline-none text-sm transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Descripción
            </label>
            <textarea
              {...register("description")}
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 focus:outline-none text-sm resize-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Imagen del servicio <span className="text-violet-500">*</span>
            </label>
            <ImageUpload
              value={imageUrl}
              onChange={(url) => {
                setImageUrl(url)
                setValue("imageUrl", url ?? "")
              }}
            />
            {errors.imageUrl && (
              <p className="text-xs text-red-500 mt-1">{errors.imageUrl.message}</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              {...register("isActive")}
              type="checkbox"
              id="isActive"
              className="w-4 h-4 rounded border-gray-300 text-violet-500 focus:ring-violet-400"
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
              className="px-4 py-2 text-sm font-medium text-white bg-linear-to-r from-violet-500 to-purple-600 rounded-lg hover:from-violet-600 hover:to-purple-700 transition disabled:opacity-50 shadow-sm"
            >
              {submitting
                ? "Guardando..."
                : mode === "create"
                  ? "Crear servicio"
                  : "Guardar cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
