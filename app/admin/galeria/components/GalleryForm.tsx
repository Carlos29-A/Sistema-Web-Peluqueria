"use client"

import { useState, useEffect } from "react"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { X, AlertCircle, Star } from "lucide-react"
import {
  gallerySchema,
  type GalleryInput,
} from "@/lib/validations/gallery"
import ImageUpload from "@/app/admin/servicios/components/ImageUpload"

interface Staff {
  id: string
  name: string
}

interface GalleryFormProps {
  mode: "create" | "edit"
  initialData?: {
    id: string
    imageUrl: string
    description: string | null
    category: string | null
    staffId: string | null
    isFeatured: boolean
  }
  onSuccess: () => void
  onClose: () => void
}

export default function GalleryForm({
  mode,
  initialData,
  onSuccess,
  onClose,
}: GalleryFormProps) {
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(initialData?.imageUrl ?? null)
  const [staff, setStaff] = useState<Staff[]>([])
  const [loadingStaff, setLoadingStaff] = useState(true)

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<GalleryInput>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(gallerySchema) as any,
    defaultValues: {
      imageUrl: initialData?.imageUrl ?? "",
      description: initialData?.description ?? "",
      category: initialData?.category ?? "",
      staffId: initialData?.staffId ?? "",
      isFeatured: initialData?.isFeatured ?? false,
    },
  })

  const isFeatured = useWatch({ control, name: "isFeatured" })

  useEffect(() => {
    async function loadStaff() {
      try {
        const res = await fetch("/api/staff?active=true")
        const data = await res.json()
        setStaff(data.staff ?? [])
      } catch {
        toast.error("Error al cargar el staff")
      } finally {
        setLoadingStaff(false)
      }
    }
    loadStaff()
  }, [])

  async function onSubmit(data: GalleryInput) {
    if (!imageUrl) {
      setSubmitError("Debes subir una imagen")
      return
    }

    setSubmitting(true)
    setSubmitError(null)

    try {
      const url =
        mode === "edit" && initialData
          ? `/api/gallery/${initialData.id}`
          : "/api/gallery"
      const method = mode === "edit" ? "PUT" : "POST"

      const payload = {
        imageUrl,
        description: data.description || null,
        category: data.category || null,
        staffId: data.staffId || null,
        isFeatured: data.isFeatured,
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
        mode === "create" ? "Imagen agregada a la galería" : "Imagen actualizada",
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
      <div className="relative bg-white rounded-xl border border-gray-200 w-full max-w-2xl shadow-lg overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-gradient-to-r from-cyan-50 to-sky-50">
          <h2 className="text-base font-bold text-gray-900">
            {mode === "create" ? "Subir imagen" : "Editar imagen"}
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
              Imagen <span className="text-cyan-500">*</span>
            </label>
            <ImageUpload
              value={imageUrl}
              onChange={(url) => {
                setImageUrl(url)
                setValue("imageUrl", url ?? "")
              }}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoría
              </label>
              <select
                {...register("category")}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 focus:outline-none text-sm transition bg-white"
              >
                <option value="">Sin categoría</option>
                <option value="Cortes">Cortes</option>
                <option value="Colores">Colores</option>
                <option value="Peinados">Peinados</option>
                <option value="Tratamientos">Tratamientos</option>
                <option value="Novias">Novias</option>
                <option value="Maquillaje">Maquillaje</option>
                <option value="Barba">Barba</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estilista
              </label>
              <select
                {...register("staffId")}
                disabled={loadingStaff}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 focus:outline-none text-sm transition bg-white disabled:opacity-50"
              >
                <option value="">Sin asignar</option>
                {staff.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              {...register("description")}
              rows={2}
              placeholder="Describe el trabajo realizado..."
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 focus:outline-none text-sm resize-none transition"
            />
            {errors.description && (
              <p className="flex items-center gap-1 text-xs text-red-500 mt-1">
                <AlertCircle className="w-3 h-3" />
                {errors.description.message}
              </p>
            )}
          </div>

          <label
            className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition ${
              isFeatured
                ? "bg-amber-50 border-amber-300"
                : "bg-gray-50 border-gray-200 hover:bg-gray-100"
            }`}
          >
            <input
              {...register("isFeatured")}
              type="checkbox"
              className="w-4 h-4 rounded border-gray-300 text-amber-500 focus:ring-amber-400"
            />
            <Star className={`w-4 h-4 ${isFeatured ? "text-amber-500 fill-amber-500" : "text-gray-400"}`} />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Marcar como destacada</p>
              <p className="text-xs text-gray-500">
                Las imágenes destacadas aparecerán primero en la galería pública
              </p>
            </div>
          </label>

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
              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-cyan-500 to-sky-500 rounded-lg hover:from-cyan-600 hover:to-sky-600 transition disabled:opacity-50 shadow-sm"
            >
              {submitting
                ? "Guardando..."
                : mode === "create"
                  ? "Subir imagen"
                  : "Guardar cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
