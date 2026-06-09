"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import Link from "next/link"
import {
  User,
  Mail,
  Phone,
  MessageSquare,
  Scissors,
  Clock,
  CalendarDays,
  UserCircle,
  CheckCircle2,
  Loader2,
  ArrowLeft,
  ArrowRight,
  MessageCircle,
  Home,
  AlertCircle,
} from "lucide-react"
import type { CatalogService, StaffWithSchedule } from "@/types"
import Container from "@/components/public/ui/Container"

const appointmentSchema = {
  clientName: (v: string) =>
    !v.trim() ? "El nombre es obligatorio" : v.length > 100 ? "Máximo 100 caracteres" : undefined,
  clientEmail: (v: string) =>
    !v.trim() ? "El email es obligatorio" : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "Email inválido" : undefined,
  clientPhone: (v: string) =>
    !v.trim() ? "El teléfono es obligatorio" : v.length < 7 ? "Teléfono inválido (mín. 7 caracteres)" : v.length > 20 ? "Teléfono inválido (máx. 20)" : undefined,
}

interface FormData {
  clientName: string
  clientEmail: string
  clientPhone: string
  notes: string
}

interface StepClientInfoProps {
  services: CatalogService[]
  staff: StaffWithSchedule[]
  selectedServiceId: string
  selectedStaffId: string | null
  selectedDate: string
  selectedTime: string
  onBack: () => void
  onComplete?: () => void
}

function formatDisplayDate(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number)
  const date = new Date(y, m - 1, d)
  return date.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export default function StepClientInfo({
  services,
  staff,
  selectedServiceId,
  selectedStaffId,
  selectedDate,
  selectedTime,
  onBack,
  onComplete,
}: StepClientInfoProps) {
  const [isSuccess, setIsSuccess] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState<FormData | null>(null)

  const selectedService = services.find((s) => s.id === selectedServiceId)
  const selectedStaff = selectedStaffId
    ? staff.find((s) => s.id === selectedStaffId)
    : null

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    defaultValues: { clientName: "", clientEmail: "", clientPhone: "", notes: "" },
    mode: "onChange",
  })

  async function onSubmit(data: FormData) {
    setSubmitError(null)
    setSubmitting(true)
    setFormData(data)

    try {
      const body = {
        clientName: data.clientName.trim(),
        clientEmail: data.clientEmail.trim(),
        clientPhone: data.clientPhone.trim(),
        serviceId: selectedServiceId,
        staffId: selectedStaffId ?? null,
        appointmentDate: selectedDate,
        appointmentTime: selectedTime,
        notes: data.notes.trim() || null,
        totalPrice: selectedService ? Number(selectedService.price) : null,
      }

      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Error al crear la reserva")
      }

      setIsSuccess(true)
      onComplete?.()
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Error al crear la reserva. Intenta de nuevo."
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <section className="py-12 sm:py-16">
        <Container>
          <div className="max-w-lg mx-auto text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 flex items-center justify-center mb-6 animate-bounce">
              <CheckCircle2 className="w-10 h-10 text-emerald-500" />
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              ¡Reserva confirmada!
            </h1>
            <p className="text-gray-500 mb-8">
              Te esperamos el{" "}
              <span className="font-semibold text-gray-700">
                {formatDisplayDate(selectedDate)}
              </span>{" "}
              a las{" "}
              <span className="font-semibold text-gray-700">{selectedTime}</span>
            </p>

            {/* Resumen final */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8 text-left space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center">
                  <Scissors className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Servicio</p>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedService?.name}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center">
                  <UserCircle className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Estilista</p>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedStaff?.name ?? "Sin preferencia"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-violet-100 flex items-center justify-center">
                  <CalendarDays className="w-4 h-4 text-violet-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Fecha y hora</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatDisplayDate(selectedDate)} a las {selectedTime}
                  </p>
                </div>
              </div>

              {formData && (
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <User className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Cliente</p>
                    <p className="text-sm font-medium text-gray-900">
                      {formData.clientName}
                    </p>
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="text-lg font-bold text-gray-900">
                    ${Number(selectedService?.price ?? 0).toLocaleString("es-CL")}
                  </p>
                </div>
              </div>
            </div>

            {/* Acciones */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={`https://wa.me/51999888777?text=Hola%2C%20quiero%20confirmar%20mi%20reserva%20para%20${selectedService?.name ?? "un servicio"}%20el%20${selectedDate}%20a%20las%20${selectedTime}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-emerald-500 hover:bg-emerald-600 rounded-xl transition-all shadow-md"
              >
                <MessageCircle className="w-4 h-4" />
                Contactar por WhatsApp
              </a>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all"
              >
                <Home className="w-4 h-4" />
                Volver al inicio
              </Link>
            </div>
          </div>
        </Container>
      </section>
    )
  }

  return (
    <section className="py-12 sm:py-16">
      <Container>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              Confirma tu reserva
            </h1>
            <p className="text-gray-600">
              Ingresa tus datos y revisa el resumen antes de confirmar
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Formulario */}
            <div className="lg:col-span-3">
              <form
                id="confirm-form"
                onSubmit={handleSubmit(onSubmit)}
                className="bg-white rounded-xl border border-gray-200 p-6 space-y-5"
              >
                <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-1">
                  Tus datos
                </h2>

                <div>
                  <label
                    htmlFor="clientName"
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                    Nombre completo <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      id="clientName"
                      {...register("clientName", {
                        validate: appointmentSchema.clientName,
                      })}
                      placeholder="Ej: María Pérez"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 outline-none transition-all text-sm"
                    />
                  </div>
                  {errors.clientName && (
                    <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.clientName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="clientEmail"
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                    Correo electrónico <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      id="clientEmail"
                      type="email"
                      {...register("clientEmail", {
                        validate: appointmentSchema.clientEmail,
                      })}
                      placeholder="Ej: maria@email.com"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 outline-none transition-all text-sm"
                    />
                  </div>
                  {errors.clientEmail && (
                    <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.clientEmail.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="clientPhone"
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                    Teléfono <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      id="clientPhone"
                      type="tel"
                      {...register("clientPhone", {
                        validate: appointmentSchema.clientPhone,
                      })}
                      placeholder="Ej: +51 999 888 777"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 outline-none transition-all text-sm"
                    />
                  </div>
                  {errors.clientPhone && (
                    <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.clientPhone.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="notes"
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                    Notas <span className="text-gray-400">(opcional)</span>
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                    <textarea
                      id="notes"
                      {...register("notes")}
                      rows={3}
                      placeholder="Ej: Prefiero que me atienda María, tengo el cabello teñido"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 outline-none transition-all text-sm resize-none"
                    />
                  </div>
                </div>

                {submitError && (
                  <div className="flex items-center gap-2 px-4 py-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {submitError}
                  </div>
                )}
              </form>
            </div>

            {/* Resumen */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-6">
                <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                  Resumen de tu cita
                </h2>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                      <Scissors className="w-4 h-4 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Servicio</p>
                      <p className="text-sm font-medium text-gray-900">
                        {selectedService?.name ?? "—"}
                      </p>
                      {selectedService && (
                        <p className="text-xs text-gray-400">
                          {selectedService.duration} min
                        </p>
                      )}
                    </div>
                    <p className="text-sm font-bold text-gray-900 ml-auto">
                      ${Number(selectedService?.price ?? 0).toLocaleString("es-CL")}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                      <UserCircle className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Estilista</p>
                      <p className="text-sm font-medium text-gray-900">
                        {selectedStaff?.name ?? "Sin preferencia"}
                      </p>
                      {selectedStaff && (
                        <p className="text-xs text-gray-400">{selectedStaff.role}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-violet-100 flex items-center justify-center shrink-0">
                      <CalendarDays className="w-4 h-4 text-violet-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Fecha</p>
                      <p className="text-sm font-medium text-gray-900">
                        {formatDisplayDate(selectedDate)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-orange-100 flex items-center justify-center shrink-0">
                      <Clock className="w-4 h-4 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Hora</p>
                      <p className="text-sm font-medium text-gray-900">
                        {selectedTime}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-gray-900">Total</p>
                      <p className="text-xl font-bold text-amber-600">
                        ${Number(selectedService?.price ?? 0).toLocaleString("es-CL")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-8 border-t border-gray-200">
            <button
              onClick={onBack}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors inline-flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver a horario
            </button>
            <button
              type="submit"
              form="confirm-form"
              disabled={submitting || !isValid}
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Confirmando...
                </>
              ) : (
                <>
                  Confirmar reserva
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </Container>
    </section>
  )
}
