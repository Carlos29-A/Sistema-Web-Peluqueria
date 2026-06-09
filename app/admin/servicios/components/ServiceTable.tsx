"use client"

import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import type { ServiceTableItem } from "@/types"
import ServiceForm from "./ServiceForm"
import Pagination from "@/components/admin/Pagination"
import SearchInput from "@/components/admin/SearchInput"
import { Plus, Pencil, Trash2, Loader2, Scissors, Power } from "lucide-react"
import { ApiError, apiFetch, PaginationMeta } from "@/lib/api-client"

const LIMIT = 20

export default function ServiceTable() {
  const [services, setServices] = useState<ServiceTableItem[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [formOpen, setFormOpen] = useState(false)
  const [formMode, setFormMode] = useState<"create" | "edit">("create")
  const [editingService, setEditingService] = useState<ServiceTableItem | undefined>(undefined)
  const [deletingService, setDeletingService] = useState<ServiceTableItem | null>(null)
  const [deletingAction, setDeletingAction] = useState(false)

  async function loadServices(p: number, s: string) {
    try {
      const params = new URLSearchParams({ page: String(p), limit: String(LIMIT) })
      if (s) params.set("search", s)
      const { data: services, meta } = await apiFetch<ServiceTableItem[], PaginationMeta>(`/api/services?${params}`)
      setServices(services)
      setTotal(meta.total)
      setTotalPages(meta.totalPages)
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Error al cargar los servicios")
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = useCallback((value: string) => {
    setSearch(value)
    setPage(1)
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true)
    loadServices(page, search)
  }, [page, search])

  function handleCreate() {
    setFormMode("create")
    setEditingService(undefined)
    setFormOpen(true)
  }

  function handleEdit(service: ServiceTableItem) {
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
    loadServices(page, search)
  }

  function openDeleteModal(service: ServiceTableItem) {
    setDeletingService(service)
  }

  async function confirmDelete() {
    if (!deletingService) return
    setDeletingAction(true)
    try {
      await apiFetch(`/api/services/${deletingService.id}`, { method: "DELETE" })
      toast.success("Servicio eliminado", { duration: 3000 })
      loadServices(page, search)
    } catch (err: unknown) {
      toast.error(err instanceof ApiError ? err.message : "Error al eliminar el servicio")
    } finally {
      setDeletingAction(false)
      setDeletingService(null)
    }
  }

  async function toggleActive(service: ServiceTableItem) {
    const newState = !service.isActive
    setServices((prev) =>
      prev.map((s) => (s.id === service.id ? { ...s, isActive: newState } : s))
    )
    try {
      await apiFetch(`/api/services/${service.id}`, {
        method: "PUT",
        body: JSON.stringify({ isActive: newState }),
      })
      toast.success(
        newState ? "Servicio activado" : "Servicio desactivado",
        { duration: 2000 }
      )
    } catch {
      setServices((prev) =>
        prev.map((s) => (s.id === service.id ? { ...s, isActive: !newState } : s))
      )
      toast.error("Error al actualizar el estado")
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
        <p className="text-sm text-gray-500">{total} servicio{total !== 1 ? "s" : ""}</p>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-violet-500 to-purple-500 rounded-lg hover:from-violet-600 hover:to-purple-600 transition shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Nuevo servicio
        </button>
      </div>

      <div className="mb-4">
        <SearchInput
          placeholder="Buscar servicio por nombre, descripción o categoría..."
          value={search}
          onSearch={handleSearch}
        />
      </div>

      {services.length === 0 ? (
        <div className="text-center py-12 text-gray-400 text-sm border border-dashed border-gray-300 rounded-lg">
          <Scissors className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          No hay servicios registrados. Crea el primero.
        </div>
      ) : (
        <div className="overflow-x-auto border border-gray-200 rounded-lg bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500 text-xs bg-gray-50">
                <th className="text-left px-4 py-3 font-medium">Nombre</th>
                <th className="text-left px-4 py-3 font-medium">Categoría</th>
                <th className="text-left px-4 py-3 font-medium">Precio</th>
                <th className="text-left px-4 py-3 font-medium">Duración</th>
                <th className="text-left px-4 py-3 font-medium">Estado</th>
                <th className="text-right px-4 py-3 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {services.map((service) => (
                <tr key={service.id} className="hover:bg-violet-50/30 transition">
                  <td className="px-4 py-3 font-medium text-gray-900">{service.name}</td>
                  <td className="px-4 py-3">
                    {service.category ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-violet-50 text-violet-600">
                        {service.category}
                      </span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium">
                    ${Number(service.price).toLocaleString("es-CL")}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{service.duration} min</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        service.isActive
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {service.isActive ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => toggleActive(service)}
                        className={`p-1.5 rounded-md transition ${
                          service.isActive
                            ? "hover:bg-amber-50 text-amber-500 hover:text-amber-600"
                            : "hover:bg-gray-100 text-gray-300 hover:text-gray-500"
                        }`}
                        title={service.isActive ? "Desactivar" : "Activar"}
                      >
                        <Power className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleEdit(service)}
                        className="p-1.5 hover:bg-gray-100 rounded-md transition"
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

      <Pagination
        page={page}
        totalPages={totalPages}
        total={total}
        limit={LIMIT}
        onPageChange={setPage}
      />

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
            ¿Estás seguro de que quieres eliminar &quot;{serviceName}&quot;? Esta acción no se puede deshacer.
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
