"use client"

import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import Image from "next/image"
import GalleryForm from "./GalleryForm"
import type { GalleryTableItem } from "@/types"
import Pagination from "@/components/admin/Pagination"
import SearchInput from "@/components/admin/SearchInput"
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Image as ImageIcon,
  Star,
  Eye,
  X,
} from "lucide-react"
import { apiFetch, PaginationMeta } from "@/lib/api-client"
import { ApiError } from "next/dist/server/api-utils"

const CATEGORIES = ["Cortes", "Colores", "Peinados", "Tratamientos", "Novias", "Maquillaje", "Barba"]

type Filter = "ALL" | "FEATURED" | string
const LIMIT = 20

export default function GalleryGrid() {
  const [items, setItems] = useState<GalleryTableItem[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [formOpen, setFormOpen] = useState(false)
  const [formMode, setFormMode] = useState<"create" | "edit">("create")
  const [editingItem, setEditingItem] = useState<GalleryTableItem | undefined>(undefined)
  const [deletingItem, setDeletingItem] = useState<GalleryTableItem | null>(null)
  const [previewItem, setPreviewItem] = useState<GalleryTableItem | null>(null)
  const [filter, setFilter] = useState<Filter>("ALL")
  const [deletingAction, setDeletingAction] = useState(false)

  const loadGallery = async (f: Filter, p: number, s: string) => {
    try {
      const params = new URLSearchParams({ page: String(p), limit: String(LIMIT) })
      if (f === "FEATURED") params.set("featured", "true")
      else if (f !== "ALL") params.set("category", f)
      if (s) params.set("search", s)

      const { data: gallery, meta } = await apiFetch<GalleryTableItem[], PaginationMeta>(`/api/gallery?${params}`)
      return { gallery, total: meta.total, totalPages: meta.totalPages }
    } catch {
      toast.error("Error al cargar la galería")
      return { gallery: [] as GalleryTableItem[], total: 0, totalPages: 0 }
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true)
    loadGallery(filter, page, search).then((data) => {
      setItems(data.gallery ?? [])
      setTotal(data.total ?? 0)
      setTotalPages(data.totalPages ?? 0)
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
    setEditingItem(undefined)
    setFormOpen(true)
  }

  function handleEdit(item: GalleryTableItem) {
    setFormMode("edit")
    setEditingItem(item)
    setFormOpen(true)
  }

  function handleCloseForm() {
    setFormOpen(false)
    setEditingItem(undefined)
  }

  function handleSuccess() {
    setFormOpen(false)
    setEditingItem(undefined)
    loadGallery(filter, page, search).then((data) => {
      setItems(data.gallery ?? [])
      setTotal(data.total ?? 0)
      setTotalPages(data.totalPages ?? 0)
    })
  }

  function openDeleteModal(item: GalleryTableItem) {
    setDeletingItem(item)
  }

  async function confirmDelete() {
    if (!deletingItem) return
    setDeletingAction(true)
    try {
      await apiFetch(`/api/gallery/${deletingItem.id}`, { method: "DELETE" })
      toast.success("Imagen eliminada", { duration: 3000 })
      loadGallery(filter, page, search).then((data) => {
        setItems(data.gallery)
        setTotal(data.total)
        setTotalPages(data.totalPages)
      })
    } catch (err: unknown) {
      toast.error(err instanceof ApiError ? err.message : "Error al eliminar la imagen", { duration: 3000 })
    } finally {
      setDeletingAction(false)
      setDeletingItem(null)
    }
  }

  const filters: { value: Filter; label: string }[] = [
    { value: "ALL", label: "Todas" },
    { value: "FEATURED", label: "Destacadas" },
    ...CATEGORIES.map((c) => ({ value: c, label: c })),
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col gap-4 mb-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            {items.length} imagen{items.length !== 1 ? "es" : ""}
          </p>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-cyan-500 to-sky-500 rounded-lg hover:from-cyan-600 hover:to-sky-600 transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Subir imagen
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => handleFilterChange(f.value)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${
                filter === f.value
                  ? "bg-cyan-500 text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <SearchInput
          placeholder="Buscar imagen por descripción o categoría..."
          value={search}
          onSearch={handleSearch}
        />
      </div>

      {items.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg bg-gradient-to-b from-cyan-50/50 to-white">
          <ImageIcon className="w-12 h-12 mx-auto mb-3 text-cyan-300" />
          <p className="text-gray-500 text-sm">No hay imágenes en la galería</p>
          <p className="text-gray-400 text-xs mt-1">Sube la primera imagen del trabajo realizado</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="group relative bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition"
            >
              <div
                className="relative aspect-square cursor-pointer"
                onClick={() => setPreviewItem(item)}
              >
                <Image
                  src={item.imageUrl}
                  alt={item.description ?? "Imagen de galería"}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                  <Eye className="w-8 h-8 text-white" />
                </div>
                {item.isFeatured && (
                  <div className="absolute top-2 left-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-400 text-amber-900 shadow-sm">
                    <Star className="w-3 h-3 fill-current" />
                    Destacada
                  </div>
                )}
                {item.category && (
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-semibold bg-white/90 text-gray-700 backdrop-blur-sm">
                    {item.category}
                  </div>
                )}
              </div>
              <div className="p-3">
                {item.description && (
                  <p className="text-xs text-gray-700 line-clamp-2 mb-1">
                    {item.description}
                  </p>
                )}
                {item.staff && (
                  <p className="text-xs text-gray-500">por {item.staff.name}</p>
                )}
                <div className="flex justify-end gap-1 mt-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-1.5 hover:bg-cyan-50 text-gray-500 hover:text-cyan-600 rounded-md transition"
                    title="Editar"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => openDeleteModal(item)}
                    className="p-1.5 hover:bg-red-50 text-gray-500 hover:text-red-600 rounded-md transition"
                    title="Eliminar"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
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
        <GalleryForm
          mode={formMode}
          initialData={editingItem}
          onSuccess={handleSuccess}
          onClose={handleCloseForm}
        />
      )}

      {deletingItem && (
        <DeleteConfirmationModal
          onConfirm={confirmDelete}
          onCancel={() => setDeletingItem(null)}
          loading={deletingAction}
        />
      )}

      {previewItem && (
        <ImagePreviewModal
          item={previewItem}
          onClose={() => setPreviewItem(null)}
        />
      )}
    </div>
  )
}

function DeleteConfirmationModal({
  onConfirm,
  onCancel,
  loading,
}: {
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
          <h3 className="text-base font-bold text-gray-900">Eliminar imagen</h3>
          <p className="text-sm text-gray-500 mt-2">
            ¿Estás seguro de que quieres eliminar esta imagen de la galería? Esta acción no se puede deshacer.
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

function ImagePreviewModal({
  item,
  onClose,
}: {
  item: GalleryTableItem
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="fixed inset-0 bg-black/80" />
      <div
        className="relative max-w-4xl w-full max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-2 -right-2 z-10 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition"
        >
          <X className="w-4 h-4" />
        </button>
        <div className="relative bg-white rounded-xl overflow-hidden shadow-2xl">
          <div className="relative aspect-video bg-gray-100">
            <Image
              src={item.imageUrl}
              alt={item.description ?? "Imagen de galería"}
              fill
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="object-contain"
            />
          </div>
          {(item.description || item.category || item.staff) && (
            <div className="p-4 border-t border-gray-200">
              {item.description && (
                <p className="text-sm text-gray-700 mb-2">{item.description}</p>
              )}
              <div className="flex flex-wrap gap-2">
                {item.category && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-cyan-100 text-cyan-700">
                    {item.category}
                  </span>
                )}
                {item.staff && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                    por {item.staff.name}
                  </span>
                )}
                {item.isFeatured && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
                    <Star className="w-3 h-3 fill-current" />
                    Destacada
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
