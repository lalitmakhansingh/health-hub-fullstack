"use client"

import type React from "react"

import { apiFetch } from "@/lib/api"
import { useState, useEffect,useRef  } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle, Calendar } from "lucide-react"
import { DOCTORS } from "@/lib/doctors"

export default function BookAppointmentSection({ onAppointmentBooked,availabilityRefreshKey }: { onAppointmentBooked: (apt: any) => void 
  availabilityRefreshKey: number}) {
  const [selectedDoctor, setSelectedDoctor] = useState("")
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [reason, setReason] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [bookedSlots, setBookedSlots] = useState<string[]>([])
  const [checkingAvailability, setCheckingAvailability] = useState(false)
  const dateInputRef = useRef<HTMLInputElement>(null)

  const selectedDoctorData = DOCTORS.find((d) => d.id.toString() === selectedDoctor)
  const availableSlots = selectedDoctorData?.slots ?? []


  // Whenever the doctor or date changes, ask the backend which of that
  // doctor's slots are already booked on that specific date, so we can
  // show them as unavailable (red, disabled) instead of letting the user
  // pick one and only finding out after clicking Book.
  useEffect(() => {
    if (!selectedDoctor || !selectedDate || !selectedDoctorData) {
      setBookedSlots([])
      return
    }

    const checkAvailability = async () => {
      setCheckingAvailability(true)
      try {
        const params = new URLSearchParams({
          doctorName: selectedDoctorData.name,
          date: selectedDate,
        })
        const { bookedSlots } = await apiFetch(`/api/appointments/availability?${params}`)
        setBookedSlots(bookedSlots)

        // If the time the user had already picked just became booked
        // (e.g. they changed the date after selecting a time), clear it.
        if (selectedTime && bookedSlots.includes(selectedTime)) {
          setSelectedTime("")
        }
      } catch {
        setBookedSlots([]) // fail open — don't block booking just because the check failed
      } finally {
        setCheckingAvailability(false)
      }
    }

    checkAvailability()
  }, [selectedDoctor, selectedDate, availabilityRefreshKey])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!selectedDoctor) newErrors.doctor = "Please select a doctor"
    if (!selectedDate) newErrors.date = "Please select a date"
    if (!selectedTime) newErrors.time = "Please select a time"
    if (!reason.trim()) newErrors.reason = "Please provide a reason for visit"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    const doctor = DOCTORS.find((d) => d.id === Number.parseInt(selectedDoctor))

    try {
      const { appointment } = await apiFetch("/api/appointments", {
        method: "POST",
        body: JSON.stringify({
          doctorName: doctor?.name,
          specialty: doctor?.specialty,
          appointmentDate: selectedDate,
          appointmentTime: selectedTime,
          reason,
        }),
      })

      onAppointmentBooked(appointment)
      setSuccess(true)
      setSelectedDoctor("")
      setSelectedDate("")
      setSelectedTime("")
      setReason("")

      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      setErrors({ submit: err.message })
    } finally {
      setIsLoading(false)
    }
  }

  const today = new Date().toISOString().split("T")[0]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Calendar className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold text-foreground">Book Appointment</h2>
      </div>

      {success && (
        <div className="p-4 bg-secondary/10 border border-secondary/30 rounded-lg flex items-center gap-3">
          <CheckCircle className="h-5 w-5 text-secondary flex-shrink-0" />
          <p className="text-sm text-foreground">Appointment booked successfully!</p>
        </div>
      )}

      {errors.submit && (
        <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />
          <p className="text-sm text-foreground">{errors.submit}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label className="text-foreground font-medium">Select Doctor</Label>
          <div className="grid grid-cols-2 gap-2">
            {DOCTORS.map((doctor) => (
              <button
                key={doctor.id}
                type="button"
                onClick={() => {
                  setSelectedDoctor(doctor.id.toString())
                  setSelectedTime("")
                  setErrors({ ...errors, doctor: "" })
                }}
                className={`p-3 rounded-lg border-2 transition-colors text-left ${
                  selectedDoctor === doctor.id.toString()
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="text-sm font-semibold text-foreground">{doctor.name}</div>
                <div className="text-xs text-muted-foreground">{doctor.specialty}</div>
              </button>
            ))}
          </div>
          {errors.doctor && (
            <div className="flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              {errors.doctor}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="date" className="text-foreground font-medium">
            Appointment Date
          </Label>
          <div onClick={() => dateInputRef.current?.showPicker?.()} className="cursor-pointer w-1/2">
            <Input
              ref={dateInputRef}
              id="date"
              type="date"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value)
                setErrors({ ...errors, date: "" })
              }}
              min={today}
              className="bg-input border-border text-foreground cursor-pointer"
              disabled={isLoading}
            />
          </div>
          {errors.date && (
            <div className="flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              {errors.date}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-foreground font-medium">
            Time Slot
            {checkingAvailability && (
              <span className="text-xs text-muted-foreground font-normal ml-2">Checking availability...</span>
            )}
          </Label>

          {!selectedDoctor ? (
            <p className="text-sm text-muted-foreground py-2">Select a doctor first</p>
          ) : !selectedDate ? (
            <p className="text-sm text-muted-foreground py-2">Select a date first</p>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {availableSlots.map((slot) => {
                const isBooked = bookedSlots.includes(slot)
                const isSelected = selectedTime === slot

                return (
                  <button
                    key={slot}
                    type="button"
                    disabled={isBooked}
                    onClick={() => {
                      setSelectedTime(slot)
                      setErrors({ ...errors, time: "" })
                    }}
                    className={`px-3 py-2 rounded-lg border-2 text-sm font-medium transition-colors ${
                      isBooked
                        ? "bg-destructive/10 border-destructive/30 text-destructive cursor-not-allowed"
                        : isSelected
                        ? "border-primary bg-primary/5 text-foreground"
                        : "border-border hover:border-primary/50 text-foreground"
                    }`}
                    title={isBooked ? "Already booked" : undefined}
                  >
                    {slot}
                    {isBooked && <span className="block text-[10px]">Booked</span>}
                  </button>
                )
              })}
            </div>
          )}

          {errors.time && (
            <div className="flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              {errors.time}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="reason" className="text-foreground font-medium">
            Reason for Visit
          </Label>
          <textarea
            id="reason"
            placeholder="Please describe your symptoms or reason for the visit..."
            value={reason}
            maxLength={50}
            onChange={(e) => {
              setReason(e.target.value)
              setErrors({ ...errors, reason: "" })
            }}
            className="w-full px-3 py-2 rounded-lg border border-border bg-input text-foreground placeholder:text-muted-foreground min-h-24 resize-none"
            disabled={isLoading}
          />
          <p className="text-xs text-muted-foreground text-right">{reason.length}/50</p>
          {errors.reason && (
            <div className="flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              {errors.reason}
            </div>
          )}
        </div>

        <Button
          type="submit"
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          disabled={isLoading}
        >
          {isLoading ? "Booking..." : "Book Appointment"}
        </Button>
      </form>
    </div>
  )
}