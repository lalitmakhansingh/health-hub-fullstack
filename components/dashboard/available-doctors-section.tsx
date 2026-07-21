import { Stethoscope } from "lucide-react"

const DOCTORS_WITH_SLOTS = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialty: "General Medicine",
    slots: ["09:00 AM", "11:00 AM", "02:00 PM"],
    experience: "12 years",
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    specialty: "Cardiology",
    slots: ["10:00 AM", "03:00 PM"],
    experience: "15 years",
  },
  {
    id: 3,
    name: "Dr. Emily Williams",
    specialty: "Dermatology",
    slots: ["09:00 AM", "10:00 AM", "11:00 AM", "04:00 PM"],
    experience: "8 years",
  },
  {
    id: 4,
    name: "Dr. James Brown",
    specialty: "Orthopedics",
    slots: ["02:00 PM", "03:00 PM", "04:00 PM"],
    experience: "10 years",
  },
]

export default function AvailableDoctorsSection() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
        <Stethoscope className="h-5 w-5 text-primary" />
        Available Doctors
      </h3>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {DOCTORS_WITH_SLOTS.map((doctor) => (
          <div key={doctor.id} className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
            <div className="font-semibold text-foreground">{doctor.name}</div>
            <div className="text-sm text-muted-foreground mb-2">{doctor.specialty}</div>
            <div className="text-xs text-muted-foreground mb-3">Experience: {doctor.experience}</div>
            <div className="text-xs font-medium text-muted-foreground mb-2">Available Slots:</div>
            <div className="flex flex-wrap gap-2">
              {doctor.slots.map((slot) => (
                <span key={slot} className="px-2 py-1 bg-primary text-primary-foreground text-xs rounded font-medium">
                  {slot}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
