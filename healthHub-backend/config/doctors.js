// Server-side source of truth for which doctors exist and which time slots
// they actually offer. Mirrors lib/doctors.ts on the frontend — kept as a
// separate copy since these are two independent codebases (frontend/backend),
// but this is the copy that actually gets enforced, since a client can be
// bypassed (Postman, curl, devtools) — this one can't.
const DOCTORS = [
  { name: "Dr. Sarah Johnson", specialty: "General Medicine", slots: ["09:00 AM", "11:00 AM", "02:00 PM"] },
  { name: "Dr. Michael Chen", specialty: "Cardiology", slots: ["10:00 AM", "03:00 PM"] },
  { name: "Dr. Emily Williams", specialty: "Dermatology", slots: ["09:00 AM", "10:00 AM", "11:00 AM", "04:00 PM"] },
  { name: "Dr. James Brown", specialty: "Orthopedics", slots: ["02:00 PM", "03:00 PM", "04:00 PM"] },
]

module.exports = DOCTORS
