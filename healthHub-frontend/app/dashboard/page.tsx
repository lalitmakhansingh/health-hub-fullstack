"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { apiFetch } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import BookAppointmentSection from "@/components/dashboard/book-appointment-section"
import AppointmentsHistorySection from "@/components/dashboard/appointments-history-section"
import AvailableDoctorsSection from "@/components/dashboard/available-doctors-section"
import MedicineTrackSection from "@/components/dashboard/medicine-track-section"

export default function DashboardPage() {
  const router = useRouter()
  const { user, checkedAuth } = useAuth()
  const [appointments, setAppointments] = useState<any[]>([])
  const [medicines, setMedicines] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!checkedAuth) return // context hasn't resolved yet — wait, don't act on stale info

    if (!user) {
      router.push("/signin")
      return
    }

    const loadData = async () => {
      try {
        const [apptRes, medRes] = await Promise.all([
          apiFetch("/api/appointments"),
          apiFetch("/api/medicines"),
        ])
        setAppointments(apptRes.appointments)
        setMedicines(medRes.medicines)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [checkedAuth, user, router])

  const handleAppointmentBooked = (newAppointment: any) => {
    setAppointments((prev) => [newAppointment, ...prev])
  }

  if (isLoading || !user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Welcome, {user.firstName}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2 p-6 border border-border">
            <BookAppointmentSection onAppointmentBooked={handleAppointmentBooked} />
          </Card>

          <Card className="p-6 border border-border">
            <AppointmentsHistorySection appointments={appointments} />
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6 border border-border">
            <AvailableDoctorsSection />
          </Card>

          <Card className="p-6 border border-border">
            <MedicineTrackSection medicines={medicines} />
          </Card>
        </div>
      </div>
    </div>
  )
}