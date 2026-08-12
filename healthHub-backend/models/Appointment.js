const mongoose = require("mongoose")

const appointmentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    doctorName: { type: String, required: true },
    specialty: { type: String, required: true },
    appointmentDate: { type: String, required: true }, // stored as "YYYY-MM-DD"
    appointmentTime: { type: String, required: true }, // e.g. "10:00 AM"
    reason: { type: String, required: true },
    status: { type: String, default: "Confirmed" },
  },
  { timestamps: true }
)

// Prevents double-booking: MongoDB will reject any insert that would create
// a second appointment for the same doctor at the same date + time, even if
// two requests arrive at nearly the same instant (this is enforced at the
// database level, so it's safe against race conditions — an app-level
// "check then create" is not, since two concurrent requests can both pass
// the check before either one finishes writing).
appointmentSchema.index(
  { doctorName: 1, appointmentDate: 1, appointmentTime: 1 },
  {
    unique: true,
    partialFilterExpression: { status: { $ne: "Cancelled" } },
  }
)

module.exports = mongoose.model("Appointment", appointmentSchema)
