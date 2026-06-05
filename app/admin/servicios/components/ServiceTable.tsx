"use client"

import { useState, useEffect, useRef } from "react"
import { toast } from "sonner"
import ServiceForm from "./ServiceForm"
import { Plus, Pencil, Trash2, Loader2, Scissors } from "lucide-react"

interface Service {
  id: string
  name: string
  description: string | null
  price: number
  duration: number
  category: string | null
  imageUrl: string | null
  isActive: boolean
}

export default function ServiceTable() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [formMode, setFormMode] = useState<"create" | "edit">("create")
  const [editingService, setEditingService] = useState<Service | undefined>(undefined)
  const [deletingService, setDeletingService] = useState<Service | null>(null)
  const [deletingAction, setDeletingAction] = useState(false)
  const hasFetched = useRef(false)

  async function loadServices() {
    try {
      const res = await fetch("/api/services")
      const data = await res.json()
      setServices(data.services ?? [])
    } catch {
      toast.error("Error al cargar los servicios")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (hasFetched.current) return
    hasFetched.current = true
    loadServices()
  }, [])

  function handleCreate() {
    setFormMode("create")
    setEditingService(undefined)
    setFormOpen(true)
  }

  function handleEdit(service: Service) {
    setFormMode("edit")
    setEditingService(service)
    setFormOpen(true)
  }

  function handleCloseForm() {
    setFormOpen(false)
    setEditingService(undefined)
  }

  function handleSuccess() {
    setFormOpen(false)
    setEditingService(undefined)
    loadServices()
  }

  function openDeleteModal(service: Service) {
    setDeletingService(service)
  }

  async function confirmDelete() {
    if (!deletingService) return
    setDeletingAction(true)
    try {
      const res = await fetch(`/api/services/${deletingService.id}`, { method: "DELETE" })
      if (!res.ok) {
        const body = await res.json()
        throw new Error(body.error || "Error al eliminar")
      }
      toast.success("Servicio eliminado", { duration: 3000 })
      loadServices()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al eliminar"
      toast.error(msg, { duration: 3000 })
    } finally {
      setDeletingAction(false)
      setDeletingService(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-6 h-6 animate-spin text-violet-400" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">
          {services.length} servicio{services.length !== 1 ? "s" : ""} registrado{services.length !== 1 ? "s" : ""}
        </p>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-violet-500 to-purple-600 rounded-lg hover:from-violet-600 hover:to-purple-700 transition shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Nuevo servicio
        </button>
      </div>

      {services.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg bg-gradient-to-b from-violet-50/50 to-white">
          <Scissors className="w-12 h-12 mx-auto mb-3 text-violet-300" />
          <p className="text-gray-500 text-sm">No hay servicios registrados</p>
          <p className="text-gray-400 text-xs mt-1">Crea el primer servicio de tu peluquería</p>
        </div>
      ) : (
        <div className="overflow-x-auto border border-gray-200 rounded-lg bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-gray-600 text-xs bg-gradient-to-r from-violet-50 to-purple-50">
                <th className="text-left px-4 py-3 font-semibold">Nombre</th>
                <th className="text-left px-4 py-3 font-semibold">Categoría</th>
                <th className="text-left px-4 py-3 font-semibold">Precio</th>
                <th className="text-left px-4 py-3 font-semibold">Duración</th>
                <th className="text-left px-4 py-3 font-semibold">Estado</th>
                <th className="text-right px-4 py-3 font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {services.map((service) => (
                <tr key={service.id} className="hover:bg-violet-50/30 transition">
                  <td className="px-4 py-3 font-medium text-gray-900">{service.name}</td>
                  <td className="px-4 py-3">
                    {service.category ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-violet-100 text-violet-700">
                        {service.category}
                      </span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-semibold text-gray-900">
                    ${Number(service.price).toLocaleString("es-CL")}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 text-gray-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-violet-400"></span>
                      {service.duration} min
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        service.isActive
                          ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                          : "bg-gray-100 text-gray-500 border border-gray-200"
                      }`}
                    >
                      {service.isActive ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleEdit(service)}
                        className="p-1.5 hover:bg-violet-100 text-gray-500 hover:text-violet-600 rounded-md transition"
                        title="Editar"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => openDeleteModal(service)}
                        className="p-1.5 hover:bg-red-50 text-gray-500 hover:text-red-600 rounded-md transition"
                        title="Eliminar"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {formOpen && (
        <ServiceForm
          mode={formMode}
          initialData={editingService}
          onSuccess={handleSuccess}
          onClose={handleCloseForm}
        />
      )}

      {deletingService && (
        <DeleteConfirmationModal
          serviceName={deletingService.name}
          onConfirm={confirmDelete}
          onCancel={() => setDeletingService(null)}
          loading={deletingAction}
        />
      )}
    </div>
  )
}

function DeleteConfirmationModal({
  serviceName,
  onConfirm,
  onCancel,
  loading,
}: {
  serviceName: string
  onConfirm: () => void
  onCancel: () => void
  loading: boolean
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" onClick={onCancel} />
      <div className="relative bg-white rounded-xl border border-gray-200 w-full max-w-sm shadow-lg overflow-hidden">
        <div className="px-5 pt-6 pb-4 text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
            <Trash2 className="w-5 h-5 text-red-600" />
          </div>
          <h3 className="text-base font-bold text-gray-900">Eliminar servicio</h3>
          <p className="text-sm text-gray-500 mt-2">
            ¿Estás seguro de que quieres eliminar{" "}
            <span className="font-medium text-gray-700">&quot;{serviceName}&quot;</span>? Esta acción no se puede deshacer.
          </p>
        </div>
        <div className="flex gap-3 px-5 pb-5">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Eliminando...
              </>
            ) : (
              "Eliminar"
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
