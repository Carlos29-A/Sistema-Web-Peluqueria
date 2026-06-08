"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import StaffForm from "./StaffForm"
import { Plus, Pencil, Trash2, Loader2, Users, AtSign, UserCircle } from "lucide-react"
import Image from "next/image"

interface Staff {
  id: string
  name: string
  role: string
  bio: string | null
  photoUrl: string | null
  instagram: string | null
  isActive: boolean
}

type Filter = "ALL" | "ACTIVE" | "INACTIVE"

export default function StaffTable() {
  const [staff, setStaff] = useState<Staff[]>([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [formMode, setFormMode] = useState<"create" | "edit">("create")
  const [editingStaff, setEditingStaff] = useState<Staff | undefined>(undefined)
  const [deletingStaff, setDeletingStaff] = useState<Staff | null>(null)
  const [deletingAction, setDeletingAction] = useState(false)
  const [filter, setFilter] = useState<Filter>("ALL")

  const fetchStaff = async (f: Filter) => {
    try {
      const url = f === "ACTIVE" ? "/api/staff?active=true" : "/api/staff"
      const res = await fetch(url)
      const data = await res.json()
      return data.staff ?? []
    } catch {
      toast.error("Error al cargar el staff")
      return []
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true)
    fetchStaff(filter).then((data) => {
      setStaff(filter === "INACTIVE" ? data.filter((s: Staff) => !s.isActive) : data)
      setLoading(false)
    })
  }, [filter])

  function handleCreate() {
    setFormMode("create")
    setEditingStaff(undefined)
    setFormOpen(true)
  }

  function handleEdit(member: Staff) {
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
    fetchStaff(filter).then((data) => {
      setStaff(filter === "INACTIVE" ? data.filter((s: Staff) => !s.isActive) : data)
    })
  }

  function openDeleteModal(member: Staff) {
    setDeletingStaff(member)
  }

  async function confirmDelete() {
    if (!deletingStaff) return
    setDeletingAction(true)
    try {
      const res = await fetch(`/api/staff/${deletingStaff.id}`, { method: "DELETE" })
      if (!res.ok) {
        const body = await res.json()
        throw new Error(body.error || "Error al eliminar")
      }
      toast.success("Miembro del staff eliminado", { duration: 3000 })
      fetchStaff(filter).then((data) => {
        setStaff(filter === "INACTIVE" ? data.filter((s: Staff) => !s.isActive) : data)
      })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al eliminar"
      toast.error(msg, { duration: 3000 })
    } finally {
      setDeletingAction(false)
      setDeletingStaff(null)
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
                onClick={() => setFilter(f.value)}
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

      {staff.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg bg-gradient-to-b from-amber-50/50 to-white">
          <UserCircle className="w-12 h-12 mx-auto mb-3 text-amber-300" />
          <p className="text-gray-500 text-sm">No hay miembros del staff registrados</p>
          <p className="text-gray-400 text-xs mt-1">Agrega al primer miembro de tu equipo</p>
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
