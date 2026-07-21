"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle, Calendar } from "lucide-react"

const DOCTORS = [
  { id: 1, name: "Dr. Sarah Johnson", specialty: "General Medicine", avatar: "SJ" },
  { id: 2, name: "Dr. Michael Chen", specialty: "Cardiology", avatar: "MC" },
  { id: 3, name: "Dr. Emily Williams", specialty: "Dermatology", avatar: "EW" },
  { id: 4, name: "Dr. James Brown", specialty: "Orthopedics", avatar: "JB" },
]

const TIME_SLOTS = ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:00 PM"]

export default function BookAppointmentSection({ onAppointmentBooked }: { onAppointmentBooked: (apt: any) => void }) {
  const [selectedDoctor, setSelectedDoctor] = useState("")
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [reason, setReason] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

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
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const doctor = DOCTORS.find((d) => d.id === Number.parseInt(selectedDoctor))
    const newAppointment = {
      id: Date.now(),
      doctor: doctor?.name,
      specialty: doctor?.specialty,
      date: selectedDate,
      time: selectedTime,
      reason,
      status: "Confirmed",
      bookedAt: new Date().toISOString(),
    }

    onAppointmentBooked(newAppointment)
    setSuccess(true)
    setSelectedDoctor("")
    setSelectedDate("")
    setSelectedTime("")
    setReason("")

    setTimeout(() => {
      setSuccess(false)
    }, 3000)

    setIsLoading(false)
  }

  // Set minimum date to today
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

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="date" className="text-foreground font-medium">
              Appointment Date
            </Label>
            <Input
              id="date"
              type="date"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value)
                setErrors({ ...errors, date: "" })
              }}
              min={today}
              className="bg-input border-border text-foreground"
              disabled={isLoading}
            />
            {errors.date && (
              <div className="flex items-center gap-2 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                {errors.date}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-foreground font-medium">Time Slot</Label>
            <select
              value={selectedTime}
              onChange={(e) => {
                setSelectedTime(e.target.value)
                setErrors({ ...errors, time: "" })
              }}
              className="w-full px-3 py-2 rounded-lg border border-border bg-input text-foreground"
              disabled={isLoading}
            >
              <option value="">Select time</option>
              {TIME_SLOTS.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
            {errors.time && (
              <div className="flex items-center gap-2 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                {errors.time}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="reason" className="text-foreground font-medium">
            Reason for Visit
          </Label>
          <textarea
            id="reason"
            placeholder="Please describe your symptoms or reason for the visit..."
            value={reason}
            onChange={(e) => {
              setReason(e.target.value)
              setErrors({ ...errors, reason: "" })
            }}
            className="w-full px-3 py-2 rounded-lg border border-border bg-input text-foreground placeholder:text-muted-foreground min-h-24 resize-none"
            disabled={isLoading}
          />
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
