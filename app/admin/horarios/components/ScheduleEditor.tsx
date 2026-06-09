"use client"

import { useState, useCallback } from "react"
import { toast } from "sonner"
import {
  ChevronDown,
  ChevronUp,
  Clock,
  Plus,
  Trash2,
  Save,
  Loader2,
  AlertCircle,
} from "lucide-react"

interface ScheduleBlock {
  dayOfWeek: number
  startTime: string
  endTime: string
}

interface ScheduleEditorProps {
  staffId: string
  staffName: string
  staffRole: string
  initialSchedules: { dayOfWeek: number; startTime: string; endTime: string }[]
}

const DAYS = [
  { value: 0, label: "Lunes" },
  { value: 1, label: "Martes" },
  { value: 2, label: "Miércoles" },
  { value: 3, label: "Jueves" },
  { value: 4, label: "Viernes" },
  { value: 5, label: "Sábado" },
  { value: 6, label: "Domingo" },
]

function timeToMinutes(t: string): number {
  const [h, m] = t.split(":").map(Number)
  return h * 60 + m
}

function hasOverlap(blocks: ScheduleBlock[]): boolean {
  const sorted = [...blocks].sort(
    (a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime)
  )
  for (let i = 1; i < sorted.length; i++) {
    if (timeToMinutes(sorted[i - 1].endTime) > timeToMinutes(sorted[i].startTime)) {
      return true
    }
  }
  return false
}

export default function ScheduleEditor({
  staffId,
  staffName,
  staffRole,
  initialSchedules,
}: ScheduleEditorProps) {
  const [expanded, setExpanded] = useState(false)
  const [saving, setSaving] = useState(false)
  const [schedules, setSchedules] = useState<ScheduleBlock[]>(initialSchedules)
  const [errors, setErrors] = useState<string | null>(null)

  const getBlocksForDay = useCallback(
    (day: number) => schedules.filter((b) => b.dayOfWeek === day),
    [schedules]
  )

  function toggleDay(day: number, enabled: boolean) {
    if (enabled) {
      // Agregar bloque por defecto
      setSchedules((prev) => [
        ...prev,
        { dayOfWeek: day, startTime: "09:00", endTime: "18:00" },
      ])
    } else {
      setSchedules((prev) => prev.filter((b) => b.dayOfWeek !== day))
    }
    setErrors(null)
  }

  function isDayActive(day: number) {
    return schedules.some((b) => b.dayOfWeek === day)
  }

  function updateBlock(
    day: number,
    index: number,
    field: "startTime" | "endTime",
    value: string
  ) {
    setSchedules((prev) => {
      const dayBlocks = prev.filter((b) => b.dayOfWeek === day)
      if (!dayBlocks[index]) return prev

      const target = dayBlocks[index]
      const updated: ScheduleBlock = { ...target, [field]: value }

      const otherBlocks = prev.filter(
        (b) => !(b.dayOfWeek === day && b.startTime === target.startTime && b.endTime === target.endTime)
      )

      return [...otherBlocks, updated]
    })
    setErrors(null)
  }

  function addBlock(day: number) {
    const dayBlocks = getBlocksForDay(day)
    const lastEnd = dayBlocks.length > 0 ? dayBlocks[dayBlocks.length - 1].endTime : "09:00"
    const [h] = lastEnd.split(":").map(Number)
    const start = `${String(Math.min(h + 1, 23)).padStart(2, "0")}:00`
    const end = `${String(Math.min(h + 2, 23)).padStart(2, "0")}:00`

    setSchedules((prev) => [...prev, { dayOfWeek: day, startTime: start, endTime: end }])
    setErrors(null)
  }

  function removeBlock(day: number, index: number) {
    const dayBlocks = getBlocksForDay(day)
    if (!dayBlocks[index]) return

    const target = dayBlocks[index]
    setSchedules((prev) =>
      prev.filter(
        (b) =>
          !(
            b.dayOfWeek === day &&
            b.startTime === target.startTime &&
            b.endTime === target.endTime
          )
      )
    )
    setErrors(null)
  }

  async function handleSave() {
    const grouped = DAYS.reduce(
      (acc, day) => {
        const blocks = getBlocksForDay(day.value)
        if (blocks.length > 0) {
          // Validar start < end
          for (const block of blocks) {
            if (timeToMinutes(block.startTime) >= timeToMinutes(block.endTime)) {
              setErrors(
                `Error en ${day.label}: la hora de inicio debe ser menor que la de fin`
              )
              return acc
            }
          }

          // Validar solapamientos
          if (hasOverlap(blocks)) {
            setErrors(`Error en ${day.label}: los bloques no pueden solaparse`)
            return acc
          }

          acc.push(...blocks)
        }
        return acc
      },
      [] as ScheduleBlock[]
    )

    if (errors) return

    setSaving(true)
    try {
      const res = await fetch(`/api/staff/${staffId}/schedule`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ schedules: grouped }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Error al guardar")
      }

      toast.success(`Horarios de ${staffName} guardados correctamente`, { duration: 3000 })
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al guardar los horarios")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm transition-all duration-300">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
            <Clock className="w-5 h-5 text-amber-600" />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-gray-900">{staffName}</p>
            <p className="text-xs text-gray-500">{staffRole}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400 bg-gray-50 px-2.5 py-1 rounded-full">
            {schedules.length} bloque{schedules.length !== 1 ? "s" : ""}
          </span>
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </div>
      </button>

      {/* Content */}
      {expanded && (
        <div className="border-t border-gray-100 px-5 py-4 space-y-4">
          {errors && (
            <div className="flex items-center gap-2 px-4 py-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {errors}
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-gray-500 border-b border-gray-100">
                  <th className="text-left py-2 pr-3 font-medium w-24">Día</th>
                  <th className="text-left py-2 px-3 font-medium">Horarios</th>
                  <th className="text-right py-2 pl-3 font-medium w-16">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {DAYS.map((day) => {
                  const active = isDayActive(day.value)
                  const blocks = getBlocksForDay(day.value)

                  return (
                    <tr key={day.value} className="group">
                      <td className="py-3 pr-3">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={active}
                            onChange={(e) => toggleDay(day.value, e.target.checked)}
                            className="w-4 h-4 rounded border-gray-300 text-amber-500 focus:ring-amber-400"
                          />
                          <span
                            className={`text-sm font-medium ${
                              active ? "text-gray-900" : "text-gray-400"
                            }`}
                          >
                            {day.label}
                          </span>
                        </label>
                      </td>
                      <td className="py-3 px-3">
                        {active ? (
                          <div className="flex flex-wrap gap-2">
                            {blocks.map((block, idx) => (
                              <div
                                key={idx}
                                className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-lg px-2 py-1.5"
                              >
                                <input
                                  type="time"
                                  value={block.startTime}
                                  onChange={(e) =>
                                    updateBlock(day.value, idx, "startTime", e.target.value)
                                  }
                                  className="w-20 text-xs bg-transparent border-none outline-none text-gray-700 font-medium"
                                />
                                <span className="text-xs text-amber-400">a</span>
                                <input
                                  type="time"
                                  value={block.endTime}
                                  onChange={(e) =>
                                    updateBlock(day.value, idx, "endTime", e.target.value)
                                  }
                                  className="w-20 text-xs bg-transparent border-none outline-none text-gray-700 font-medium"
                                />
                                <button
                                  onClick={() => removeBlock(day.value, idx)}
                                  className="ml-1 p-0.5 rounded hover:bg-amber-200 text-amber-400 hover:text-red-500 transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                            <button
                              onClick={() => addBlock(day.value)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-dashed border-gray-300 text-xs text-gray-500 hover:border-amber-300 hover:text-amber-600 hover:bg-amber-50 transition-all"
                            >
                              <Plus className="w-3 h-3" />
                              Añadir
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-300">No laborable</span>
                        )}
                      </td>
                      <td className="py-3 pl-3 text-right">
                        {active && (
                          <button
                            onClick={() => {
                              setSchedules((prev) =>
                                prev.filter((b) => b.dayOfWeek !== day.value)
                              )
                              setErrors(null)
                            }}
                            className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-50 text-gray-300 hover:text-red-500 transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end pt-2 border-t border-gray-100">
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all shadow-sm"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {saving ? "Guardando..." : "Guardar horarios"}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
