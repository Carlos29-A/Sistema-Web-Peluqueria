import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
  page: number
  totalPages: number
  total: number
  limit: number
  onPageChange: (page: number) => void
}

export default function Pagination({
  page,
  totalPages,
  total,
  limit,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null

  const from = (page - 1) * limit + 1
  const to = Math.min(page * limit, total)

  function getPages(): (number | "dots")[] {
    const pages: (number | "dots")[] = []
    const maxVisible = 5

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
      return pages
    }

    let start = Math.max(1, page - 2)
    let end = Math.min(totalPages, page + 2)

    if (page <= 3) {
      start = 1
      end = maxVisible
    } else if (page >= totalPages - 2) {
      start = totalPages - maxVisible + 1
      end = totalPages
    }

    if (start > 1) {
      pages.push(1)
      if (start > 2) pages.push("dots")
    }

    for (let i = start; i <= end; i++) pages.push(i)

    if (end < totalPages) {
      if (end < totalPages - 1) pages.push("dots")
      pages.push(totalPages)
    }

    return pages
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-100">
      <p className="text-xs text-gray-400 order-2 sm:order-1">
        Mostrando <span className="font-medium text-gray-600">{from}-{to}</span> de{" "}
        <span className="font-medium text-gray-600">{total}</span> registros
      </p>

      <div className="flex items-center gap-1.5 order-1 sm:order-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Anterior</span>
        </button>

        <div className="flex items-center gap-1">
          {getPages().map((p, i) =>
            p === "dots" ? (
              <span key={`dots-${i}`} className="px-1.5 text-xs text-gray-300 select-none">
                ...
              </span>
            ) : (
              <button
                key={p}
                onClick={() => onPageChange(p)}
                className={`min-w-8 h-8 rounded-lg text-xs font-medium transition-all ${
                  p === page
                    ? "bg-linear-to-br from-amber-500 to-orange-500 text-white shadow-sm shadow-amber-200"
                    : "text-gray-600 hover:bg-gray-100 border border-transparent hover:border-gray-200"
                }`}
              >
                {p}
              </button>
            )
          )}
        </div>

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <span className="hidden sm:inline">Siguiente</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}
