"use client"

import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import type { AppointmentTableItem, StatusFilter } from "@/types"
import AppointmentForm from "./AppointmentForm"
import StatusBadge from "./StatusBadge"
import Pagination from "@/components/admin/Pagination"
import SearchInput from "@/components/admin/SearchInput"
import { Plus, Pencil, Trash2, Loader2, Calendar, Filter } from "lucide-react"
import { ApiError, apiFetch, PaginationMeta } from "@/lib/api-client"

const LIMIT = 20

export default function AppointmentTable() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL")
  const [search, setSearch] = useState("")
  const [appointments, setAppointments] = useState<AppointmentTableItem[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [formOpen, setFormOpen] = useState(false)
  const [formMode, setFormMode] = useState<"create" | "edit">("create")
  const [editingAppointment, setEditingAppointment] = useState<AppointmentTableItem | undefined>(undefined)
  const [deletingAppointment, setDeletingAppointment] = useState<AppointmentTableItem | null>(null)
  const [deletingAction, setDeletingAction] = useState(false)

  const loadAppointments = async (filter: StatusFilter, p: number, s: string) => {
    try {
      const params = new URLSearchParams({ page: String(p), limit: String(LIMIT) })
      if (filter !== "ALL") params.set("status", filter)
      if (s) params.set("search", s)
      const { data: appointments, meta } = await apiFetch<AppointmentTableItem[], PaginationMeta>(`/api/appointments?${params}`)
      return { appointments, total: meta.total, totalPages: meta.totalPages }
    } catch {
      toast.error("Error al cargar las citas")
      return { appointments: [] as AppointmentTableItem[], total: 0, totalPages: 0 }
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true)
    loadAppointments(statusFilter, page, search).then((data) => {
      setAppointments(data.appointments)
      setTotal(data.total)
      setTotalPages(data.totalPages)
      setLoading(false)
    })
  }, [statusFilter, page, search])

  const handleSearch = useCallback((value: string) => {
    setSearch(value)
    setPage(1)
  }, [])

  function handleFilterChange(filter: StatusFilter) {
    setStatusFilter(filter)
    setPage(1)
    setSearch("")
  }

  function handleCreate() {
    setFormMode("create")
    setEditingAppointment(undefined)
    setFormOpen(true)
  }

  function handleEdit(appointment: AppointmentTableItem) {
    setFormMode("edit")
    setEditingAppointment(appointment)
    setFormOpen(true)
  }

  function handleCloseForm() {
    setFormOpen(false)
    setEditingAppointment(undefined)
  }

  function handleSuccess() {
    setFormOpen(false)
    setEditingAppointment(undefined)
    loadAppointments(statusFilter, page, search).then((data) => {
      setAppointments(data.appointments)
      setTotal(data.total)
      setTotalPages(data.totalPages)
    })
  }

  function openDeleteModal(appointment: AppointmentTableItem) {
    setDeletingAppointment(appointment)
  }

  async function confirmDelete() {
    if (!deletingAppointment) return
    setDeletingAction(true)
    try {
      await apiFetch(`/api/appointments/${deletingAppointment.id}`, { method: "DELETE" })
      toast.success("Cita eliminada", { duration: 3000 })
      loadAppointments(statusFilter, page, search).then((data) => {
        setAppointments(data.appointments)
        setTotal(data.total)
        setTotalPages(data.totalPages)
      })
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Error al eliminar", { duration: 3000 })
    } finally {
      setDeletingAction(false)
      setDeletingAppointment(null)
    }
  }

  const filters: { value: StatusFilter; label: string }[] = [
    { value: "ALL", label: "Todas" },
    { value: "PENDING", label: "Pendientes" },
    { value: "CONFIRMED", label: "Confirmadas" },
    { value: "COMPLETED", label: "Completadas" },
    { value: "CANCELLED", label: "Canceladas" },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => handleFilterChange(filter.value)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${
                  statusFilter === filter.value
                    ? "bg-rose-500 text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-rose-500 to-pink-500 rounded-lg hover:from-rose-600 hover:to-pink-600 transition shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Nueva cita
        </button>
      </div>

      <div className="mb-4">
        <SearchInput
          placeholder="Buscar cliente por nombre o email..."
          value={search}
          onSearch={handleSearch}
        />
      </div>

      {appointments.length === 0 ? (
        <div className="text-center py-12 text-gray-400 text-sm border border-dashed border-gray-300 rounded-lg">
          <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          {total === 0
            ? "No hay citas registradas. Crea la primera."
            : "No hay citas en esta página."}
        </div>
      ) : (
        <div className="overflow-x-auto border border-gray-200 rounded-lg bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500 text-xs bg-gray-50">
                <th className="text-left px-4 py-3 font-medium">Cliente</th>
                <th className="text-left px-4 py-3 font-medium">Servicio</th>
                <th className="text-left px-4 py-3 font-medium">Estilista</th>
                <th className="text-left px-4 py-3 font-medium">Fecha</th>
                <th className="text-left px-4 py-3 font-medium">Hora</th>
                <th className="text-left px-4 py-3 font-medium">Estado</th>
                <th className="text-left px-4 py-3 font-medium">Precio</th>
                <th className="text-right px-4 py-3 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {appointments.map((appointment) => (
                <tr key={appointment.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-gray-900">{appointment.clientName}</p>
                      <p className="text-xs text-gray-500">{appointment.clientEmail}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-gray-900">{appointment.service.name}</p>
                      <p className="text-xs text-gray-500">{appointment.service.duration} min</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {appointment.staff?.name ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {format(new Date(appointment.appointmentDate), "dd/MM/yyyy", { locale: es })}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{appointment.appointmentTime}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={appointment.status} />
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {appointment.totalPrice
                      ? `$${Number(appointment.totalPrice).toLocaleString("es-CL")}`
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleEdit(appointment)}
                        className="p-1.5 hover:bg-gray-100 rounded-md transition"
                        title="Editar"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => openDeleteModal(appointment)}
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
        <AppointmentForm
          mode={formMode}
          initialData={
            editingAppointment
              ? {
                  ...editingAppointment,
                  appointmentDate: editingAppointment.appointmentDate,
                }
              : undefined
          }
          onSuccess={handleSuccess}
          onClose={handleCloseForm}
        />
      )}

      {deletingAppointment && (
        <DeleteConfirmationModal
          clientName={deletingAppointment.clientName}
          onConfirm={confirmDelete}
          onCancel={() => setDeletingAppointment(null)}
          loading={deletingAction}
        />
      )}
    </div>
  )
}

function DeleteConfirmationModal({
  clientName,
  onConfirm,
  onCancel,
  loading,
}: {
  clientName: string
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
          <h3 className="text-base font-bold text-gray-900">Eliminar cita</h3>
          <p className="text-sm text-gray-500 mt-2">
            ¿Estás seguro de que quieres eliminar la cita de{" "}
            <span className="font-medium text-gray-700">&quot;{clientName}&quot;</span>? Esta acción no se puede deshacer.
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
