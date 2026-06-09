"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Search, X, Loader2 } from "lucide-react"

interface SearchInputProps {
  placeholder?: string
  value: string
  onSearch: (value: string) => void
  loading?: boolean
}

export default function SearchInput({
  placeholder = "Buscar...",
  value: externalValue,
  onSearch,
  loading = false,
}: SearchInputProps) {
  const [internalValue, setInternalValue] = useState(externalValue)
  const prevExternalRef = useRef(externalValue)

  useEffect(() => {
    if (externalValue !== prevExternalRef.current) {
      prevExternalRef.current = externalValue
      setInternalValue(externalValue)
    }
  }, [externalValue])

  const handleSearch = useCallback(() => {
    onSearch(internalValue)
  }, [internalValue, onSearch])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault()
        onSearch(internalValue)
      }
    },
    [internalValue, onSearch]
  )

  const handleClear = useCallback(() => {
    setInternalValue("")
    onSearch("")
  }, [onSearch])

  return (
    <div className="relative flex items-center gap-2">
      <div className="relative flex-1">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
          {loading ? (
            <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />
          ) : (
            <Search className="w-4 h-4 text-gray-400" />
          )}
        </div>
        <input
          type="text"
          value={internalValue}
          onChange={(e) => setInternalValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full pl-10 pr-9 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition-all placeholder:text-gray-400"
        />
        {internalValue && (
          <button
            onClick={handleClear}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      <button
        onClick={handleSearch}
        disabled={!internalValue || loading}
        className="p-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
      >
        <Search className="w-4 h-4" />
      </button>
    </div>
  )
}
