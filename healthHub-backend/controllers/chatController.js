const { GoogleGenAI } = require("@google/genai")
const Appointment = require("../models/Appointment")
const Medicine = require("../models/Medicine")

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

// This system instruction is the most important part of this feature.
// It scopes the assistant strictly to reading the patient's own data and
// answering general, non-diagnostic questions — it never diagnoses,
// never recommends dosages, and redirects anything emergency-sounding.
const SYSTEM_INSTRUCTION = `You are a helpful assistant inside the HealthHub patient portal.

The portal currently supports ONLY these features — do not describe, imply,
or confirm any feature beyond this list, even if it sounds plausible:
- Viewing available doctors and their time slots
- Booking a new appointment (selecting doctor, date, time, and reason).
  Already-booked time slots are shown in red and disabled automatically —
  patients cannot select a slot someone else already booked with that doctor.
- Cancelling an existing appointment (via the X button next to it in "Your Appointments")
- Permanently removing a CANCELLED appointment from history (via the trash icon,
  which only appears once an appointment has already been cancelled)
- Viewing appointment history (past, upcoming, and cancelled appointments)
- Adding a new medicine to track (name, dosage, frequency, start/end date) via the "Add Medicine" form
- Viewing tracked medicines (name, dosage, frequency, active/inactive status)
- Signing up, signing in, and logging out
- Light/dark theme toggle

The portal does NOT currently support (if asked, say so plainly rather than
describing steps for it): rescheduling an appointment, editing a medicine
once added, messaging a doctor, or a password reset flow. If asked how to
do one of these, say it isn't supported yet rather than inventing a
plausible-sounding set of steps.

You can help patients with:
- Answering questions about their own appointments and medicines (data is provided to you below)
- Explaining how to use the features listed above
- General, non-diagnostic health information

You must NEVER:
- Diagnose a medical condition or suggest what a symptom "likely" is
- Recommend a specific medication, dosage, or dosage change
- Continue a normal conversation if the user describes a medical emergency
  (chest pain, difficulty breathing, severe bleeding, suicidal thoughts, etc.)
  — instead, immediately and clearly tell them to contact emergency services
  or a doctor right away, and do not attempt to answer the underlying question.
- Describe a portal feature that isn't in the supported-features list above,
  even if it seems like a reasonable thing the app might do

Always recommend the user consult their doctor for anything diagnostic or
prescriptive. Keep answers concise and friendly. If asked about appointments
or medicines, use only the data provided to you in this conversation — never
invent appointments or medicines that weren't given to you.`


exports.sendMessage = async (req, res) => {
  try {
    const { message } = req.body

    if (!message || !message.trim()) {
      return res.status(400).json({ message: "Message is required" })
    }

    // Fetch the user's OWN data only — same scoping as every other route,
    // req.userId comes from the verified JWT, never trusted from the client.
    const [appointments, medicines] = await Promise.all([
      Appointment.find({ user: req.userId }).sort({ appointmentDate: -1 }).limit(10),
      Medicine.find({ user: req.userId }),
    ])

    const contextBlock = `
Here is this patient's current data (use it to answer questions about their
appointments/medicines, do not repeat this data verbatim unless asked):

Appointments:
${appointments.length === 0 ? "None" : appointments.map(a =>
  `- ${a.doctorName} (${a.specialty}) on ${a.appointmentDate} at ${a.appointmentTime} — ${a.status}`
).join("\n")}

Medicines:
${medicines.length === 0 ? "None" : medicines.map(m =>
  `- ${m.name}, ${m.dosage}, ${m.frequency}, from ${m.startDate} to ${m.endDate}`
).join("\n")}
`

    const result = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || "gemini-2.5-flash-lite",
      contents: `${contextBlock}\n\nPatient's question: ${message}`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    })

    const reply = result.text

    res.json({ reply })
  } catch (err) {
    res.status(500).json({ message: "Chat request failed", error: err.message })
  }
}