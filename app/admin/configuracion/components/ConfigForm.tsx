"use client"

import { useState, useEffect } from "react"
import { useForm, type Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Save, Loader2, Building2, Phone, AtSign, Clock } from "lucide-react"
import {
  businessConfigFormSchema,
  type BusinessConfigFormInput,
  CURRENCIES,
} from "@/lib/validations/business-config"
import { ApiError, apiFetch } from "@/lib/api-client"

type ConfigData = {
  business_name: string
  currency: string
  phone: string
  whatsapp: string
  email: string
  address: string
  instagram: string
  facebook: string
  opening_hours: string
}

const SECTION_CONFIG = [
  {
    title: "Datos del negocio",
    icon: Building2,
    fields: ["business_name", "currency"],
  },
  {
    title: "Contacto",
    icon: Phone,
    fields: ["phone", "whatsapp", "email", "address"],
  },
  {
    title: "Redes sociales",
    icon: AtSign,
    fields: ["instagram", "facebook"],
  },
  {
    title: "Horarios",
    icon: Clock,
    fields: ["opening_hours"],
  },
] as const

export default function ConfigForm() {
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<BusinessConfigFormInput>({ resolver: zodResolver(businessConfigFormSchema) as Resolver<BusinessConfigFormInput>,
    defaultValues: {
      business_name: "",
      currency: "USD",
      phone: "",
      whatsapp: "",
      email: "",
      address: "",
      instagram: "",
      facebook: "",
      opening_hours: "",
    },
  })

  useEffect(() => {
    apiFetch<ConfigData>("/api/business-config")
      .then(({ data }) => {
        reset({
          business_name: data.business_name ?? "",
          currency: data.currency ?? "USD",
          phone: data.phone ?? "",
          whatsapp: data.whatsapp ?? "",
          email: data.email ?? "",
          address: data.address ?? "", 
          instagram: data.instagram ?? "",
          facebook: data.facebook ?? "",
          opening_hours: data.opening_hours ?? "",
        } as BusinessConfigFormInput)
        setLoading(false)
      })
      .catch(() => {
        toast.error("Error al cargar la configuración")
        setLoading(false)
      })
  }, [reset])

  async function onSubmit(data: BusinessConfigFormInput) {
    setSubmitting(true)
    try {
      await apiFetch("/api/business-config", {
        method: "PUT",
        body: JSON.stringify(data),
      })
      toast.success("Configuración guardada correctamente")
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Error al guardar la configuración")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
        <span className="ml-3 text-sm text-gray-500">Cargando configuración...</span>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {SECTION_CONFIG.map((section) => {
        const Icon = section.icon
        return (
          <div
            key={section.title}
            className="bg-white rounded-xl border border-gray-200 overflow-hidden"
          >
            <div className="flex items-center gap-2.5 px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <Icon className="w-4 h-4 text-gray-500" />
              <h3 className="text-sm font-semibold text-gray-900">{section.title}</h3>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {section.fields.map((fieldName) => (
                  <div
                    key={fieldName}
                    className={fieldName === "opening_hours" || fieldName === "address" ? "sm:col-span-2" : ""}
                  >
                    <label
                      htmlFor={fieldName}
                      className="block text-sm font-medium text-gray-700 mb-1.5"
                    >
                      {getFieldLabel(fieldName)}
                      {isFieldRequired(fieldName) && (
                        <span className="text-red-500 ml-0.5">*</span>
                      )}
                    </label>

                    {fieldName === "currency" ? (
                      <select
                        id={fieldName}
                        {...register("currency")}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-colors"
                      >
                        {CURRENCIES.map((c) => (
                          <option key={c.code} value={c.code}>
                            {c.symbol} — {c.name} ({c.code})
                          </option>
                        ))}
                      </select>
                    ) : fieldName === "opening_hours" ? (
                      <textarea
                        id={fieldName}
                        {...register(fieldName)}
                        rows={3}
                        placeholder="Ej: Lunes a Sábado: 9am - 6pm"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-colors resize-none"
                      />
                    ) : (
                      <input
                        id={fieldName}
                        type={fieldName === "email" ? "email" : "text"}
                        {...register(fieldName)}
                        placeholder={getFieldPlaceholder(fieldName)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-colors"
                      />
                    )}

                    {errors[fieldName as keyof BusinessConfigFormInput] && (
                      <p className="mt-1.5 text-xs text-red-500">
                        {errors[fieldName as keyof BusinessConfigFormInput]?.message}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      })}

      <div className="flex items-center justify-end gap-3">
        <button
          type="submit"
          disabled={submitting || !isDirty}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-amber-500 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors shadow-sm"
        >
          {submitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {submitting ? "Guardando..." : "Guardar cambios"}
        </button>
      </div>
    </form>
  )
}

function getFieldLabel(field: string): string {
  const labels: Record<string, string> = {
    business_name: "Nombre del negocio",
    currency: "Moneda",
    phone: "Teléfono",
    whatsapp: "WhatsApp",
    email: "Email",
    address: "Dirección",
    instagram: "Instagram",
    facebook: "Facebook",
    opening_hours: "Horarios de atención",
  }
  return labels[field] ?? field
}

function getFieldPlaceholder(field: string): string {
  const placeholders: Record<string, string> = {
    business_name: "Ej: GlamStudio",
    phone: "Ej: +51 999 888 777",
    whatsapp: "Ej: +51999888777",
    email: "Ej: contacto@glamstudio.pe",
    address: "Ej: Av. Principal 123, Lima",
    instagram: "Ej: glamstudiope",
    facebook: "Ej: glamstudiope",
    opening_hours: "Ej: Lunes a Sábado: 9am - 6pm",
  }
  return placeholders[field] ?? ""
}

function isFieldRequired(field: string): boolean {
  return field === "business_name" || field === "currency"
}
