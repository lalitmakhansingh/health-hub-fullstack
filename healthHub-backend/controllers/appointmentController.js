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

exports.getAvailability = async (req, res) => {
  try {
    const { doctorName, date, excludeId } = req.query

    if (!doctorName || !date) {
      return res.status(400).json({ message: "doctorName and date are required" })
    }

    const query = {
      doctorName,
      appointmentDate: date,
      status: { $ne: "Cancelled" },
    }

    // When rescheduling, exclude the appointment's own current slot from
    // the "already booked" check — otherwise it would appear to conflict
    // with itself, blocking the user from keeping their existing time.
    if (excludeId) {
      query._id = { $ne: excludeId }
    }

    const bookedAppointments = await Appointment.find(query).select("appointmentTime")
    const bookedSlots = bookedAppointments.map((a) => a.appointmentTime)
    res.json({ bookedSlots })
  } catch (err) {
    res.status(500).json({ message: "Failed to check availability", error: err.message })
  }
}

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

// PATCH /api/appointments/:id/reschedule — changes the date/time of an
// existing appointment, keeping the same doctor and history intact.
exports.rescheduleAppointment = async (req, res) => {
  try {
    const { appointmentDate, appointmentTime } = req.body

    if (!appointmentDate || !appointmentTime) {
      return res.status(400).json({ message: "New date and time are required" })
    }

    const appointment = await Appointment.findById(req.params.id)

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" })
    }

    if (appointment.user.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized to reschedule this appointment" })
    }

    if (appointment.status === "Cancelled") {
      return res.status(400).json({ message: "Cannot reschedule a cancelled appointment" })
    }

    // Re-validate the new slot against the doctor's real offered times —
    // same rule as booking, since a reschedule is really "book a new time"
    // in disguise.
    const doctor = DOCTORS.find((d) => d.name === appointment.doctorName)
    if (!doctor || !doctor.slots.includes(appointmentTime)) {
      return res.status(400).json({ message: `${appointment.doctorName} is not available at ${appointmentTime}` })
    }

    appointment.appointmentDate = appointmentDate
    appointment.appointmentTime = appointmentTime
    await appointment.save() // triggers the unique index check against other active appointments

    res.json({ appointment })
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "This time slot is already booked. Please choose another." })
    }
    res.status(500).json({ message: "Failed to reschedule appointment", error: err.message })
  }
}


// PATCH /api/appointments/:id/cancel — marks an appointment as Cancelled
// rather than deleting it, so appointment history stays intact.
exports.cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" })
    }

    // Ownership check — a user can only cancel their OWN appointment.
    // Without this, any logged-in user could cancel anyone's appointment
    // just by guessing/enumerating IDs, since Mongo IDs aren't secret.
    if (appointment.user.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized to cancel this appointment" })
    }

    if (appointment.status === "Cancelled") {
      return res.status(400).json({ message: "Appointment is already cancelled" })
    }

    appointment.status = "Cancelled"
    await appointment.save()

    res.json({ appointment })
  } catch (err) {
    res.status(500).json({ message: "Failed to cancel appointment", error: err.message })
  }
}

// DELETE /api/appointments/:id — permanently removes an appointment.
// Only allowed on appointments that are already Cancelled, as a safety
// rule — prevents accidentally deleting an active/upcoming appointment
// that a patient still needs.
exports.deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" })
    }

    if (appointment.user.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized to delete this appointment" })
    }

    if (appointment.status !== "Cancelled") {
      return res.status(400).json({ message: "Only cancelled appointments can be removed" })
    }

    await appointment.deleteOne()
    res.json({ message: "Appointment removed" })
  } catch (err) {
    res.status(500).json({ message: "Failed to remove appointment", error: err.message })
  }
}
