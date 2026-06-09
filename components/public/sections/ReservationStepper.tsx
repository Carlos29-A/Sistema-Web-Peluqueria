"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check } from "lucide-react"
import type { CatalogService, StaffWithSchedule } from "@/types"
import StepSelectService from "@/components/public/cards/StepSelectService"
import StepSelectStaff from "@/components/public/cards/StepSelectStaff"
import StepClientInfo from "@/components/public/cards/StepClientInfo"

interface ReservationStepperProps {
  services: CatalogService[]
  staff: StaffWithSchedule[]
  defaultServiceId?: string
  defaultStaffId?: string
}

const STEPS = [
  { label: "Servicio" },
  { label: "Horario" },
  { label: "Confirmar" },
]

export default function ReservationStepper({
  services,
  staff,
  defaultServiceId,
  defaultStaffId,
}: ReservationStepperProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(
    defaultServiceId ?? null
  )
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(
    defaultStaffId ?? null
  )
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")

  function handleNext() {
    if (currentStep < 3) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  function handleBack() {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  function handleStaffSelect(staffId: string | null, date: string, time: string) {
    setSelectedStaffId(staffId)
    setSelectedDate(date)
    setSelectedTime(time)
  }

  return (
    <div className="min-h-[80vh] bg-gradient-to-b from-amber-50/40 to-white">
      {/* Stepper Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-5">
          <div className="flex items-center justify-center gap-0">
            {STEPS.map((step, index) => {
              const stepNumber = index + 1
              const isActive = currentStep === stepNumber
              const isCompleted = currentStep > stepNumber

              return (
                <div key={step.label} className="flex items-center">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                        isCompleted
                          ? "bg-emerald-500 text-white"
                          : isActive
                          ? "bg-amber-500 text-white shadow-md shadow-amber-200"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        stepNumber
                      )}
                    </div>
                    <span
                      className={`text-sm font-medium hidden sm:inline transition-colors ${
                        isActive
                          ? "text-gray-900"
                          : isCompleted
                          ? "text-gray-500"
                          : "text-gray-400"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                  {index < STEPS.length - 1 && (
                    <div
                      className={`w-12 sm:w-20 h-0.5 mx-2 sm:mx-3 rounded-full transition-colors duration-300 ${
                        isCompleted ? "bg-emerald-500" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
        >
          {currentStep === 1 && (
            <StepSelectService
              services={services}
              defaultServiceId={selectedServiceId ?? undefined}
              onSelect={setSelectedServiceId}
              onNext={handleNext}
            />
          )}

          {currentStep === 2 && (
            <StepSelectStaff
              staff={staff}
              services={services}
              selectedServiceId={selectedServiceId ?? services[0]?.id ?? ""}
              defaultStaffId={selectedStaffId ?? undefined}
              onSelect={handleStaffSelect}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {currentStep === 3 && (
            <StepClientInfo
              services={services}
              staff={staff}
              selectedServiceId={selectedServiceId ?? services[0]?.id ?? ""}
              selectedStaffId={selectedStaffId}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              onBack={handleBack}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
