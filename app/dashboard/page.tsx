"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import BookAppointmentSection from "@/components/dashboard/book-appointment-section"
import AppointmentsHistorySection from "@/components/dashboard/appointments-history-section"
import AvailableDoctorsSection from "@/components/dashboard/available-doctors-section"
import MedicineTrackSection from "@/components/dashboard/medicine-track-section"

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [appointments, setAppointments] = useState<any[]>([])
  const [medicines, setMedicines] = useState<any[]>([])

  useEffect(() => {
    const userSession = localStorage.getItem("userSession")
    if (!userSession) {
      router.push("/signin")
      return
    }
    setUser(JSON.parse(userSession))

    // Load appointments and medicines from localStorage
    const savedAppointments = localStorage.getItem("userAppointments")
    const savedMedicines = localStorage.getItem("userMedicines")

    if (savedAppointments) {
      setAppointments(JSON.parse(savedAppointments))
    }
    if (savedMedicines) {
      setMedicines(JSON.parse(savedMedicines))
    } else {
      // Initialize with demo medicines
      const demoMedicines = [
        {
          id: 1,
          name: "Aspirin",
          dosage: "500mg",
          frequency: "2x daily",
          startDate: "2025-01-15",
          endDate: "2025-02-15",
        },
        {
          id: 2,
          name: "Vitamin D",
          dosage: "1000 IU",
          frequency: "Once daily",
          startDate: "2024-12-01",
          endDate: "2025-12-01",
        },
        {
          id: 3,
          name: "Lisinopril",
          dosage: "10mg",
          frequency: "Once daily",
          startDate: "2024-11-20",
          endDate: "2025-11-20",
        },
      ]
      setMedicines(demoMedicines)
      localStorage.setItem("userMedicines", JSON.stringify(demoMedicines))
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("userSession")
    localStorage.removeItem("userAppointments")
    router.push("/signin")
  }

  const handleAppointmentBooked = (newAppointment: any) => {
    const updated = [...appointments, newAppointment]
    setAppointments(updated)
    localStorage.setItem("userAppointments", JSON.stringify(updated))
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
            <p className="text-sm text-muted-foreground">Welcome, {user.name}</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2 bg-transparent">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
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
