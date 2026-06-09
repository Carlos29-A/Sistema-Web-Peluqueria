"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import Image from "next/image"
import {
  ChevronLeft,
  ChevronRight,
  UserCircle,
  Clock,
  Check,
  Loader2,
  Users,
} from "lucide-react"
import type { CatalogService, StaffWithSchedule } from "@/types"
import Container from "@/components/public/ui/Container"
import {
  getCalendarDays,
  getMonthName,
  getScheduleForDay,
  getAvailableSlots,
  formatDate,
  isDateInPast,
  getStaffsForService,
  type AvailableSlot,
  type ExistingAppointment,
} from "@/lib/utils/availability"

interface StepSelectStaffProps {
  staff: StaffWithSchedule[]
  services: CatalogService[]
  selectedServiceId: string
  defaultStaffId?: string
  onSelect: (staffId: string | null, date: string, time: string) => void
  onNext: () => void
  onBack: () => void
}

export default function StepSelectStaff({
  staff,
  services,
  selectedServiceId,
  defaultStaffId,
  onSelect,
  onNext,
  onBack,
}: StepSelectStaffProps) {
  const selectedService = services.find((s) => s.id === selectedServiceId)
  const serviceDuration = selectedService?.duration ?? 60

  const availableStaff = useMemo(
    () => getStaffsForService(staff, selectedServiceId),
    [staff, selectedServiceId]
  )

  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(
    availableStaff.some((s) => s.id === defaultStaffId) ? defaultStaffId ?? null : null
  )
  const [calendarDate, setCalendarDate] = useState(() => new Date())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [slots, setSlots] = useState<AvailableSlot[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)

  const calendarYear = calendarDate.getFullYear()
  const calendarMonth = calendarDate.getMonth()
  const calendarDays = useMemo(
    () => getCalendarDays(calendarYear, calendarMonth),
    [calendarYear, calendarMonth]
  )

  const availableDates = useMemo(() => {
    if (!selectedStaffId) return []
    const days: string[] = []
    const today = new Date()
    const year = today.getFullYear()
    const month = today.getMonth()

    const staffMember = staff.find((s) => s.id === selectedStaffId)
    if (!staffMember) return days

    for (let d = 0; d < 60; d++) {
      const date = new Date(year, month, today.getDate() + d)
      const dateStr = formatDate(date)
      const schedule = getScheduleForDay(staffMember.schedules, dateStr)
      if (schedule) {
        days.push(dateStr)
      }
    }
    return days
  }, [selectedStaffId, staff])

  const fetchSlots = useCallback(async (staffId: string | null, date: string) => {
    setLoadingSlots(true)
    setSelectedTime(null)

    const staffMembers = staffId
      ? staff.filter((s) => s.id === staffId)
      : availableStaff

    try {
      const allSlots: AvailableSlot[] = []

      for (const member of staffMembers) {
        const schedule = getScheduleForDay(member.schedules, date)
        if (!schedule) continue

        const queryDate = date
        const staffFilter = member.id
        const res = await fetch(
          `/api/appointments?date=${queryDate}&staffId=${staffFilter}&limit=100`
        )
        const data = await res.json()
        const existing: ExistingAppointment[] = (data.appointments ?? []).map(
          (a: { appointmentTime: string; service: { duration: number } }) => ({
            appointmentTime: a.appointmentTime,
            service: { duration: a.service.duration },
          })
        )

        const memberSlots = getAvailableSlots(schedule, serviceDuration, existing)
        allSlots.push(...memberSlots)
      }

      const uniqueSlots = allSlots.filter(
        (s, i, arr) => arr.findIndex((x) => x.time === s.time) === i
      )
      uniqueSlots.sort((a, b) => a.time.localeCompare(b.time))

      setSlots(uniqueSlots)
    } catch {
      setSlots([])
    } finally {
      setLoadingSlots(false)
    }
  }, [staff, availableStaff, serviceDuration])

  useEffect(() => {
    if (selectedStaffId !== null && selectedDate) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchSlots(selectedStaffId, selectedDate)
    }
  }, [selectedStaffId, selectedDate, fetchSlots])

  function handleSelectStaff(id: string | null) {
    setSelectedStaffId(id)
    setSelectedDate(null)
    setSelectedTime(null)
    setSlots([])
    onSelect(id, "", "")
  }

  function handleSelectDate(dateStr: string) {
    setSelectedDate(dateStr)
    setSelectedTime(null)
    if (selectedStaffId !== null) {
      fetchSlots(selectedStaffId, dateStr)
    }
  }

  function handleSelectTime(time: string) {
    setSelectedTime(time)
    if (selectedStaffId !== null && selectedDate) {
      onSelect(selectedStaffId, selectedDate, time)
    }
  }

  const prevMonth = () =>
    setCalendarDate(new Date(calendarYear, calendarMonth - 1, 1))
  const nextMonth = () =>
    setCalendarDate(new Date(calendarYear, calendarMonth + 1, 1))

  return (
    <section className="py-12 sm:py-16">
      <Container>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              Elige tu estilista y horario
            </h1>
            <p className="text-gray-600">
              {selectedService
                ? `Servicio seleccionado: ${selectedService.name} (${selectedService.duration} min)`
                : "Selecciona quién prefieres que te atienda"}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Left: Staff Selection */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                Elige un estilista
              </h2>

              {availableStaff.length === 0 ? (
                <div className="text-center py-8 bg-white rounded-xl border border-gray-200">
                  <Users className="w-8 h-8 mx-auto text-gray-300 mb-2" />
                  <p className="text-sm text-gray-500">
                    No hay estilistas disponibles para este servicio
                  </p>
                </div>
              ) : (
                <>
                  {/* Sin preferencia */}
                  <button
                    onClick={() => handleSelectStaff(null)}
                    className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                      selectedStaffId === null
                        ? "border-amber-500 bg-amber-50/50 shadow-sm ring-1 ring-amber-200"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        selectedStaffId === null
                          ? "bg-amber-100 text-amber-600"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      <Users className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        Sin preferencia
                      </p>
                      <p className="text-xs text-gray-500">
                        Cualquier estilista disponible
                      </p>
                    </div>
                    {selectedStaffId === null && (
                      <Check className="w-5 h-5 text-amber-500" />
                    )}
                  </button>

                  {/* Staff cards */}
                  {availableStaff.map((member) => {
                    const isSelected = selectedStaffId === member.id
                    return (
                      <button
                        key={member.id}
                        onClick={() => handleSelectStaff(member.id)}
                        className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                          isSelected
                            ? "border-amber-500 bg-amber-50/50 shadow-sm ring-1 ring-amber-200"
                            : "border-gray-200 hover:border-gray-300 bg-white"
                        }`}
                      >
                        <div className="w-10 h-10 rounded-full shrink-0 overflow-hidden bg-gradient-to-br from-amber-100 to-orange-100">
                          {member.photoUrl ? (
                            <Image
                              src={member.photoUrl}
                              alt={member.name}
                              width={40}
                              height={40}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <UserCircle className="w-6 h-6 text-amber-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {member.name}
                          </p>
                          <p className="text-xs text-gray-500">{member.role}</p>
                        </div>
                        {isSelected && (
                          <Check className="w-5 h-5 text-amber-500 shrink-0" />
                        )}
                      </button>
                    )
                  })}
                </>
              )}
            </div>

            {/* Right: Calendar + Slots */}
            <div className="lg:col-span-3 space-y-6">
              {selectedStaffId !== null || selectedStaffId === null ? (
                <>
                  {/* Calendar */}
                  <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <div className="flex items-center justify-between mb-4">
                      <button
                        onClick={prevMonth}
                        className="p-1.5 hover:bg-gray-100 rounded-lg transition"
                      >
                        <ChevronLeft className="w-4 h-4 text-gray-600" />
                      </button>
                      <p className="text-sm font-semibold text-gray-900">
                        {getMonthName(calendarMonth)} {calendarYear}
                      </p>
                      <button
                        onClick={nextMonth}
                        className="p-1.5 hover:bg-gray-100 rounded-lg transition"
                      >
                        <ChevronRight className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-center mb-2">
                      {["Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"].map((d) => (
                        <span
                          key={d}
                          className="text-xs font-medium text-gray-500 py-1"
                        >
                          {d}
                        </span>
                      ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                      {calendarDays.map((day, i) => {
                        if (day === null) {
                          return <div key={`empty-${i}`} />
                        }

                        const dateStr = `${calendarYear}-${String(calendarMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
                        const isPast = isDateInPast(dateStr)
                        const isAvailable = availableDates.includes(dateStr)
                        const isSelected = selectedDate === dateStr

                        return (
                          <button
                            key={dateStr}
                            disabled={isPast || (!isAvailable && selectedStaffId !== null)}
                            onClick={() => handleSelectDate(dateStr)}
                            className={`p-2 text-sm rounded-lg transition-all duration-200
                              ${
                                isSelected
                                  ? "bg-amber-500 text-white font-bold shadow-sm"
                                  : isPast
                                  ? "text-gray-300 cursor-not-allowed"
                                  : !isAvailable && selectedStaffId !== null
                                  ? "text-gray-300 cursor-not-allowed"
                                  : "text-gray-700 hover:bg-amber-50 hover:text-amber-700"
                              }`}
                          >
                            {day}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Time Slots */}
                  <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <h3 className="text-sm font-semibold text-gray-900 mb-4">
                      {selectedDate
                        ? `Horarios disponibles para el ${selectedDate}`
                        : "Selecciona una fecha"}
                    </h3>

                    {loadingSlots ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-5 h-5 text-amber-500 animate-spin" />
                        <span className="ml-2 text-sm text-gray-500">
                          Cargando horarios...
                        </span>
                      </div>
                    ) : selectedDate && slots.length === 0 ? (
                      <p className="text-sm text-gray-500 text-center py-8">
                        No hay horarios disponibles para esta fecha.
                      </p>
                    ) : selectedDate ? (
                      <div className="flex flex-wrap gap-2">
                        {slots.map((slot) => {
                          const isSelected = selectedTime === slot.time
                          return (
                            <button
                              key={slot.time}
                              disabled={slot.disabled}
                              onClick={() => handleSelectTime(slot.time)}
                              className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                                ${
                                  isSelected
                                    ? "bg-amber-500 text-white shadow-md"
                                    : slot.disabled
                                    ? "bg-gray-100 text-gray-300 cursor-not-allowed line-through"
                                    : "bg-gray-50 text-gray-700 border border-gray-200 hover:border-amber-300 hover:text-amber-700 hover:bg-amber-50"
                                }`}
                            >
                              <Clock className="w-3.5 h-3.5" />
                              {slot.display}
                            </button>
                          )
                        })}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400 text-center py-8">
                        {selectedStaffId !== null
                          ? "Selecciona una fecha para ver los horarios disponibles"
                          : "Elige un estilista o \"Sin preferencia\" primero"}
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                  <UserCircle className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-500 text-sm">
                    Selecciona un estilista para ver el calendario y horarios disponibles
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-10 pt-8 border-t border-gray-200">
            <button
              onClick={onBack}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors inline-flex items-center gap-1"
            >
              ← Volver a servicios
            </button>
            <div className="text-sm text-gray-500">
              {selectedTime
                ? `${selectedDate} a las ${selectedTime}`
                : "Selecciona fecha y hora"}
            </div>
            <button
              onClick={onNext}
              disabled={!selectedDate || !selectedTime}
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Siguiente →
            </button>
          </div>
        </div>
      </Container>
    </section>
  )
}
