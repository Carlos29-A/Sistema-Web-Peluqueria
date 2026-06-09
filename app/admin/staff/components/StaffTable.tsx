"use client"

import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import type { StaffTableItem } from "@/types"
import StaffForm from "./StaffForm"
import Pagination from "@/components/admin/Pagination"
import SearchInput from "@/components/admin/SearchInput"
import { Plus, Pencil, Trash2, Loader2, Users, AtSign, UserCircle, Power } from "lucide-react"
import Image from "next/image"
import { ApiError, apiFetch, PaginationMeta } from "@/lib/api-client"

type Filter = "ALL" | "ACTIVE" | "INACTIVE"
const LIMIT = 20

export default function StaffTable() {
  const [staff, setStaff] = useState<StaffTableItem[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [formOpen, setFormOpen] = useState(false)
  const [formMode, setFormMode] = useState<"create" | "edit">("create")
  const [editingStaff, setEditingStaff] = useState<StaffTableItem | undefined>(undefined)
  const [deletingStaff, setDeletingStaff] = useState<StaffTableItem | null>(null)
  const [deletingAction, setDeletingAction] = useState(false)
  const [filter, setFilter] = useState<Filter>("ALL")

  const loadStaff = async (f: Filter, p: number, s: string) => {
    try {
      const params = new URLSearchParams({ page: String(p), limit: String(LIMIT) })
      if (f === "ACTIVE") params.set("active", "true")
      else if (f === "INACTIVE") params.set("active", "false")
      if (s) params.set("search", s)
      const { data: staff, meta } = await apiFetch<StaffTableItem[], PaginationMeta>(`/api/staff?${params}`)
      return { staff, total: meta.total, totalPages: meta.totalPages }
    } catch {
      toast.error("Error al cargar el staff")
      return { staff: [] as StaffTableItem[], total: 0, totalPages: 0 }
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true)
    loadStaff(filter, page, search).then((data) => {
      setStaff(data.staff)
      setTotal(data.total)
      setTotalPages(data.totalPages)
      setLoading(false)
    })
  }, [filter, page, search])

  const handleSearch = useCallback((value: string) => {
    setSearch(value)
    setPage(1)
  }, [])

  function handleFilterChange(f: Filter) {
    setFilter(f)
    setPage(1)
    setSearch("")
  }

  function handleCreate() {
    setFormMode("create")
    setEditingStaff(undefined)
    setFormOpen(true)
  }

  function handleEdit(member: StaffTableItem) {
    setFormMode("edit")
    setEditingStaff(member)
    setFormOpen(true)
  }

  function handleCloseForm() {
    setFormOpen(false)
    setEditingStaff(undefined)
  }

  function handleSuccess() {
    setFormOpen(false)
    setEditingStaff(undefined)
    loadStaff(filter, page, search).then((data) => {
      setStaff(data.staff)
      setTotal(data.total)
      setTotalPages(data.totalPages)
    })
  }

  function openDeleteModal(member: StaffTableItem) {
    setDeletingStaff(member)
  }

  async function confirmDelete() {
    if (!deletingStaff) return
    setDeletingAction(true)
    try {
      await apiFetch(`/api/staff/${deletingStaff.id}`, { method: "DELETE" })
      toast.success("Miembro del staff eliminado", { duration: 3000 })
      loadStaff(filter, page, search).then((data) => {
        setStaff(data.staff)
        setTotal(data.total)
        setTotalPages(data.totalPages)
      })
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Error al eliminar", { duration: 3000 })
    } finally {
      setDeletingAction(false)
      setDeletingStaff(null)
    }
  }

  async function toggleActive(member: StaffTableItem) {
    const newState = !member.isActive
    setStaff((prev) =>
      prev.map((m) => (m.id === member.id ? { ...m, isActive: newState } : m))
    )

    try {
      await apiFetch(`/api/staff/${member.id}`, {
        method: "PUT",
        body: JSON.stringify({ isActive: newState }),
      })
      toast.success(
        newState ? "Staff activado" : "Staff desactivado",
        { duration: 2000 }
      )
    } catch {
      setStaff((prev) =>
        prev.map((m) => (m.id === member.id ? { ...m, isActive: !newState } : m))
      )
      toast.error("Error al actualizar el estado")
    }
  }

  const filters: { value: Filter; label: string }[] = [
    { value: "ALL", label: "Todos" },
    { value: "ACTIVE", label: "Activos" },
    { value: "INACTIVE", label: "Inactivos" },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-6 h-6 animate-spin text-amber-400" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f.value}
                onClick={() => handleFilterChange(f.value)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${
                  filter === f.value
                    ? "bg-amber-500 text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg hover:from-amber-600 hover:to-orange-600 transition shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Nuevo miembro
        </button>
      </div>

      <div className="mb-4">
        <SearchInput
          placeholder="Buscar miembro por nombre o rol..."
          value={search}
          onSearch={handleSearch}
        />
      </div>

      {staff.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg bg-gradient-to-b from-amber-50/50 to-white">
          <UserCircle className="w-12 h-12 mx-auto mb-3 text-amber-300" />
          <p className="text-gray-500 text-sm">No hay miembros del staff registrados</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {staff.map((member) => (
            <div
              key={member.id}
              className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition group"
            >
              <div className="flex items-start gap-3">
                <div className="shrink-0">
                  {member.photoUrl ? (
                    <Image
                      src={member.photoUrl}
                      alt={member.name}
                      width={56}
                      height={56}
                      className="w-14 h-14 rounded-full object-cover border-2 border-amber-200"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center border-2 border-amber-200">
                      <UserCircle className="w-8 h-8 text-amber-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 truncate">{member.name}</h3>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                        member.isActive
                          ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                          : "bg-gray-100 text-gray-500 border border-gray-200"
                      }`}
                    >
                      {member.isActive ? "Activo" : "Inactivo"}
                    </span>
                  </div>
                  <p className="text-sm text-amber-600 font-medium mt-0.5">{member.role}</p>
                  {member.instagram && (
                    <a
                      href={`https://instagram.com/${member.instagram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-pink-500 transition mt-1"
                    >
                      <AtSign className="w-3 h-3" />
                      @{member.instagram}
                    </a>
                  )}
                  {member.bio && (
                    <p className="text-xs text-gray-500 mt-2 line-clamp-2">{member.bio}</p>
                  )}
                </div>
              </div>
              <div className="flex justify-end gap-1 mt-3 pt-3 border-t border-gray-100">
                <button
                  onClick={() => toggleActive(member)}
                  className={`p-1.5 rounded-md transition ${
                    member.isActive
                      ? "hover:bg-amber-50 text-amber-500 hover:text-amber-600"
                      : "hover:bg-gray-100 text-gray-300 hover:text-gray-500"
                  }`}
                  title={member.isActive ? "Desactivar" : "Activar"}
                >
                  <Power className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleEdit(member)}
                  className="p-1.5 hover:bg-amber-50 text-gray-500 hover:text-amber-600 rounded-md transition"
                  title="Editar"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => openDeleteModal(member)}
                  className="p-1.5 hover:bg-red-50 text-gray-500 hover:text-red-600 rounded-md transition"
                  title="Eliminar"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
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
        <StaffForm
          mode={formMode}
          initialData={editingStaff}
          onSuccess={handleSuccess}
          onClose={handleCloseForm}
        />
      )}

      {deletingStaff && (
        <DeleteConfirmationModal
          staffName={deletingStaff.name}
          onConfirm={confirmDelete}
          onCancel={() => setDeletingStaff(null)}
          loading={deletingAction}
        />
      )}
    </div>
  )
}

function DeleteConfirmationModal({
  staffName,
  onConfirm,
  onCancel,
  loading,
}: {
  staffName: string
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
            <Users className="w-5 h-5 text-red-600" />
          </div>
          <h3 className="text-base font-bold text-gray-900">Eliminar miembro del staff</h3>
          <p className="text-sm text-gray-500 mt-2">
            ¿Estás seguro de que quieres eliminar a{" "}
            <span className="font-medium text-gray-700">&quot;{staffName}&quot;</span>? Esta acción no se puede deshacer.
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
