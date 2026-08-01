const Appointment = require("../models/Appointment")
const DOCTORS = require("../config/doctors")

// GET /api/appointments — only returns the logged-in user's own appointments
exports.getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ user: req.userId }).sort({ appointmentDate: -1 })
    res.json({ appointments })
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch appointments", error: err.message })
  }
}

// POST /api/appointments
exports.createAppointment = async (req, res) => {
  try {
    const { doctorName, specialty, appointmentDate, appointmentTime, reason } = req.body

    if (!doctorName || !specialty || !appointmentDate || !appointmentTime || !reason) {
      return res.status(400).json({ message: "All fields are required" })
    }

    // Server-side check that the doctor exists and actually offers this slot —
    // enforced here because a frontend-only check (a filtered <select>) can
    // always be bypassed by calling this endpoint directly.
    const doctor = DOCTORS.find((d) => d.name === doctorName)
    if (!doctor) {
      return res.status(400).json({ message: "Unknown doctor" })
    }
    if (!doctor.slots.includes(appointmentTime)) {
      return res.status(400).json({ message: `${doctorName} is not available at ${appointmentTime}` })
    }

    const appointment = await Appointment.create({
      user: req.userId, // taken from the verified JWT, never trusted from the request body
      doctorName,
      specialty,
      appointmentDate,
      appointmentTime,
      reason,
    })

    res.status(201).json({ appointment })
  } catch (err) {
    // 11000 = MongoDB duplicate key error, thrown when the unique index on
    // (doctorName, appointmentDate, appointmentTime) blocks a double-booking
    if (err.code === 11000) {
      return res.status(409).json({ message: "This time slot is already booked. Please choose another." })
    }
    res.status(500).json({ message: "Failed to book appointment", error: err.message })
  }
}
