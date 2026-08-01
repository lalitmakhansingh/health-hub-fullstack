import { Calendar, Clock } from "lucide-react"

export default function AppointmentsHistorySection({ appointments }: { appointments: any[] }) {
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
              <div className="mt-2 inline-block px-2 py-1 bg-secondary/20 text-secondary text-xs font-medium rounded">
                {apt.status}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}