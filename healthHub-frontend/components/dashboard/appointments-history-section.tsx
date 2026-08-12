"use client"

import { Calendar, Clock, X, Trash2, RefreshCw } from "lucide-react"
import { useState, useEffect } from "react"
import { apiFetch } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DOCTORS } from "@/lib/doctors"

export default function AppointmentsHistorySection({
  appointments,
  onAppointmentCancelled,
  onAppointmentRemoved,
  onAppointmentRescheduled,
}: {
  appointments: any[]
  onAppointmentCancelled: (appointmentId: string) => void
  onAppointmentRemoved: (appointmentId: string) => void
  onAppointmentRescheduled: (appointment: any) => void
}) {
  const [cancellingId, setCancellingId] = useState<string | null>(null)
  const [removingId, setRemovingId] = useState<string | null>(null)

  // Reschedule panel state — only one appointment's panel can be open at once
  const [reschedulingId, setReschedulingId] = useState<string | null>(null)
  const [newDate, setNewDate] = useState("")
  const [newTime, setNewTime] = useState("")
  const [bookedSlots, setBookedSlots] = useState<string[]>([])
  const [checkingAvailability, setCheckingAvailability] = useState(false)
  const [rescheduleError, setRescheduleError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const reschedulingAppointment = appointments.find((a) => a._id === reschedulingId)
  const doctorData = DOCTORS.find((d) => d.name === reschedulingAppointment?.doctorName)
  const doctorSlots = doctorData?.slots ?? []
  const today = new Date().toISOString().split("T")[0]

  // Check availability whenever the reschedule panel's date changes —
  // excludeId makes sure the appointment's OWN current slot doesn't
  // appear as "booked" against itself.
  useEffect(() => {
    if (!reschedulingId || !newDate || !reschedulingAppointment) {
      setBookedSlots([])
      return
    }

    const checkAvailability = async () => {
      setCheckingAvailability(true)
      try {
        const params = new URLSearchParams({
          doctorName: reschedulingAppointment.doctorName,
          date: newDate,
          excludeId: reschedulingId,
        })
        const { bookedSlots } = await apiFetch(`/api/appointments/availability?${params}`)
        setBookedSlots(bookedSlots)
        if (newTime && bookedSlots.includes(newTime)) {
          setNewTime("")
        }
      } catch {
        setBookedSlots([])
      } finally {
        setCheckingAvailability(false)
      }
    }

    checkAvailability()
  }, [reschedulingId, newDate])

  const openReschedule = (apt: any) => {
    setReschedulingId(apt._id)
    setNewDate(apt.appointmentDate)
    setNewTime(apt.appointmentTime)
    setRescheduleError("")
  }

  const closeReschedule = () => {
    setReschedulingId(null)
    setNewDate("")
    setNewTime("")
    setBookedSlots([])
    setRescheduleError("")
  }

  const handleCancel = async (id: string) => {
    const confirmed = window.confirm("Are you sure you want to cancel this appointment?")
    if (!confirmed) return

    setCancellingId(id)
    try {
      await apiFetch(`/api/appointments/${id}/cancel`, { method: "PATCH" })
      onAppointmentCancelled(id)
    } catch (err: any) {
      alert(err.message)
    } finally {
      setCancellingId(null)
    }
  }

  const handleRemove = async (id: string) => {
    const confirmed = window.confirm("Permanently remove this cancelled appointment from your history?")
    if (!confirmed) return

    setRemovingId(id)
    try {
      await apiFetch(`/api/appointments/${id}`, { method: "DELETE" })
      onAppointmentRemoved(id)
    } catch (err: any) {
      alert(err.message)
    } finally {
      setRemovingId(null)
    }
  }

  const handleRescheduleSubmit = async (id: string) => {
    if (!newDate || !newTime) {
      setRescheduleError("Please select a date and time")
      return
    }

    setIsSubmitting(true)
    setRescheduleError("")
    try {
      const { appointment } = await apiFetch(`/api/appointments/${id}/reschedule`, {
        method: "PATCH",
        body: JSON.stringify({ appointmentDate: newDate, appointmentTime: newTime }),
      })
      onAppointmentRescheduled(appointment)
      closeReschedule()
    } catch (err: any) {
      setRescheduleError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
        <Calendar className="h-5 w-5 text-primary" />
        Your Appointments
      </h3>

      {appointments.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>No appointments booked yet</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {appointments.map((apt) => (
            <div
              key={apt._id}
              className="p-3 bg-secondary/5 border border-secondary/20 rounded-lg hover:bg-secondary/10 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="font-semibold text-sm text-foreground">{apt.doctorName}</div>
                  <div className="text-xs text-muted-foreground mb-2">{apt.specialty}</div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(apt.appointmentDate).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {apt.appointmentTime}
                  </div>
                  {apt.reason && (
                    <p className="text-xs text-muted-foreground mt-2 italic">"{apt.reason}"</p>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  {apt.status !== "Cancelled" && (
                    <button
                      onClick={() => openReschedule(apt)}
                      disabled={cancellingId === apt._id}
                      className="text-muted-foreground hover:text-primary transition-colors p-1"
                      title="Reschedule appointment"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </button>
                  )}

                  {apt.status !== "Cancelled" ? (
                    <button
                      onClick={() => handleCancel(apt._id)}
                      disabled={cancellingId === apt._id}
                      className="text-muted-foreground hover:text-destructive transition-colors p-1"
                      title="Cancel appointment"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleRemove(apt._id)}
                      disabled={removingId === apt._id}
                      className="text-muted-foreground hover:text-destructive transition-colors p-1"
                      title="Remove from history"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              <div
                className={`mt-2 inline-block px-2 py-1 text-xs font-medium rounded ${
                  apt.status === "Cancelled"
                    ? "bg-destructive/20 text-destructive"
                    : "bg-secondary/20 text-secondary"
                }`}
              >
                {cancellingId === apt._id
                  ? "Cancelling..."
                  : removingId === apt._id
                  ? "Removing..."
                  : apt.status}
              </div>

              {/* Inline reschedule panel */}
              {reschedulingId === apt._id && (
                <div className="mt-3 pt-3 border-t border-border space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-foreground">New date</label>
                    <Input
                      type="date"
                      value={newDate}
                      min={today}
                      onChange={(e) => setNewDate(e.target.value)}
                      className="bg-input border-border text-foreground text-sm"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-foreground">
                      New time
                      {checkingAvailability && (
                        <span className="text-xs text-muted-foreground font-normal ml-2">Checking...</span>
                      )}
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {doctorSlots.map((slot) => {
                        const isBooked = bookedSlots.includes(slot)
                        const isSelected = newTime === slot
                        return (
                          <button
                            key={slot}
                            type="button"
                            disabled={isBooked || isSubmitting}
                            onClick={() => setNewTime(slot)}
                            className={`px-2 py-1.5 rounded-lg border-2 text-xs font-medium transition-colors ${
                              isBooked
                                ? "bg-destructive/10 border-destructive/30 text-destructive cursor-not-allowed"
                                : isSelected
                                ? "border-primary bg-primary/5 text-foreground"
                                : "border-border hover:border-primary/50 text-foreground"
                            }`}
                          >
                            {slot}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {rescheduleError && (
                    <p className="text-xs text-destructive">{rescheduleError}</p>
                  )}

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleRescheduleSubmit(apt._id)}
                      disabled={isSubmitting}
                      className="flex-1"
                    >
                      {isSubmitting ? "Saving..." : "Confirm"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={closeReschedule}
                      disabled={isSubmitting}
                      className="flex-1 bg-transparent"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}