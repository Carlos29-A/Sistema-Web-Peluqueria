"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { X, AlertCircle } from "lucide-react"
import {
  appointmentSchema,
  type AppointmentInput,
} from "@/lib/validations/appointment"

interface Service {
  id: string
  name: string
  price: number
  duration: number
}

interface Staff {
  id: string
  name: string
}

interface AppointmentFormProps {
  mode: "create" | "edit"
  initialData?: {
    id: string
    clientName: string
    clientEmail: string
    clientPhone: string
    serviceId: string
    staffId: string | null
    appointmentDate: string
    appointmentTime: string
    status: string
    notes: string | null
    totalPrice: number | null
  }
  onSuccess: () => void
  onClose: () => void
}

type FormData = AppointmentInput & {
  status?: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED"
}

export default function AppointmentForm({
  mode,
  initialData,
  onSuccess,
  onClose,
}: AppointmentFormProps) {
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [services, setServices] = useState<Service[]>([])
  const [staff, setStaff] = useState<Staff[]>([])
  const [loadingData, setLoadingData] = useState(true)

  const isEdit = mode === "edit"

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(appointmentSchema) as any,
    defaultValues: isEdit
      ? {
          clientName: initialData?.clientName ?? "",
          clientEmail: initialData?.clientEmail ?? "",
          clientPhone: initialData?.clientPhone ?? "",
          serviceId: initialData?.serviceId ?? "",
          staffId: initialData?.staffId ?? "",
          appointmentDate: initialData?.appointmentDate
            ? new Date(initialData.appointmentDate).toISOString().split("T")[0]
            : "",
          appointmentTime: initialData?.appointmentTime ?? "",
          status: (initialData?.status as FormData["status"]) ?? "PENDING",
          notes: initialData?.notes ?? "",
          totalPrice: initialData?.totalPrice ? Number(initialData.totalPrice) : undefined,
        }
      : {
          status: "PENDING",
        },
  })

  useEffect(() => {
    async function loadData() {
      try {
        const [servicesRes, staffRes] = await Promise.all([
          fetch("/api/services?active=true"),
          fetch("/api/staff?active=true"),
        ])
        const servicesData = await servicesRes.json()
        const staffData = await staffRes.json()
        setServices(servicesData.services ?? [])
        setStaff(staffData.staff ?? [])
      } catch {
        toast.error("Error al cargar datos")
      } finally {
        setLoadingData(false)
      }
    }
    loadData()
  }, [])

  async function onSubmit(data: FormData) {
    setSubmitting(true)
    setSubmitError(null)

    try {
      const url =
        mode === "edit" && initialData
          ? `/api/appointments/${initialData.id}`
          : "/api/appointments"
      const method = mode === "edit" ? "PUT" : "POST"

      const payload = {
        ...data,
        staffId: data.staffId || null,
        notes: data.notes || null,
        totalPrice: data.totalPrice || null,
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
        mode === "create" ? "Cita creada correctamente" : "Cita actualizada",
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

  if (loadingData) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/40" onClick={onClose} />
        <div className="relative bg-white rounded-xl border border-gray-200 w-full max-w-lg shadow-lg p-8 text-center">
          <p className="text-sm text-gray-500">Cargando datos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-xl border border-gray-200 w-full max-w-lg shadow-lg overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-gradient-to-r from-rose-50 to-pink-50">
          <h2 className="text-base font-bold text-gray-900">
            {mode === "create" ? "Nueva cita" : "Editar cita"}
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

          <div className="space-y-4 pb-4 border-b border-gray-100">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Datos del cliente
            </p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre completo <span className="text-rose-500">*</span>
              </label>
              <input
                {...register("clientName")}
                type="text"
                placeholder="Ej: María González"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 focus:outline-none text-sm transition"
              />
              {errors.clientName && (
                <p className="flex items-center gap-1 text-xs text-red-500 mt-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.clientName.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-rose-500">*</span>
                </label>
                <input
                  {...register("clientEmail")}
                  type="email"
                  placeholder="correo@ejemplo.com"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 focus:outline-none text-sm transition"
                />
                {errors.clientEmail && (
                  <p className="flex items-center gap-1 text-xs text-red-500 mt-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.clientEmail.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono <span className="text-rose-500">*</span>
                </label>
                <input
                  {...register("clientPhone")}
                  type="tel"
                  placeholder="+56 9 1234 5678"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 focus:outline-none text-sm transition"
                />
                {errors.clientPhone && (
                  <p className="flex items-center gap-1 text-xs text-red-500 mt-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.clientPhone.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4 pb-4 border-b border-gray-100">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Detalles de la cita
            </p>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Servicio <span className="text-rose-500">*</span>
              </label>
              <select
                {...register("serviceId")}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 focus:outline-none text-sm transition bg-white"
              >
                <option value="">Seleccionar servicio...</option>
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} — ${Number(s.price).toLocaleString("es-CL")} ({s.duration} min)
                  </option>
                ))}
              </select>
              {errors.serviceId && (
                <p className="flex items-center gap-1 text-xs text-red-500 mt-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.serviceId.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estilista
              </label>
              <select
                {...register("staffId")}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 focus:outline-none text-sm transition bg-white"
              >
                <option value="">Sin asignar</option>
                {staff.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha <span className="text-rose-500">*</span>
                </label>
                <input
                  {...register("appointmentDate")}
                  type="date"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 focus:outline-none text-sm transition"
                />
                {errors.appointmentDate && (
                  <p className="flex items-center gap-1 text-xs text-red-500 mt-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.appointmentDate.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hora <span className="text-rose-500">*</span>
                </label>
                <input
                  {...register("appointmentTime")}
                  type="time"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 focus:outline-none text-sm transition"
                />
                {errors.appointmentTime && (
                  <p className="flex items-center gap-1 text-xs text-red-500 mt-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.appointmentTime.message}
                  </p>
                )}
              </div>
            </div>

            {isEdit && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado
                </label>
                <select
                  {...register("status")}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 focus:outline-none text-sm transition bg-white"
                >
                  <option value="PENDING">Pendiente</option>
                  <option value="CONFIRMED">Confirmada</option>
                  <option value="COMPLETED">Completada</option>
                  <option value="CANCELLED">Cancelada</option>
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Precio total ($)
              </label>
              <input
                {...register("totalPrice")}
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 focus:outline-none text-sm transition"
              />
              {errors.totalPrice && (
                <p className="flex items-center gap-1 text-xs text-red-500 mt-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.totalPrice.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notas
              </label>
              <textarea
                {...register("notes")}
                rows={2}
                placeholder="Observaciones especiales..."
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 focus:outline-none text-sm transition resize-none"
              />
            </div>
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
              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-rose-500 to-pink-500 rounded-lg hover:from-rose-600 hover:to-pink-600 transition disabled:opacity-50 shadow-sm"
            >
              {submitting
                ? "Guardando..."
                : mode === "create"
                  ? "Crear cita"
                  : "Guardar cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
