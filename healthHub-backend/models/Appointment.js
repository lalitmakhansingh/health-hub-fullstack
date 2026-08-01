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

appointmentSchema.index(
  { doctorName: 1, appointmentDate: 1, appointmentTime: 1 },
  { unique: true }
)

module.exports = mongoose.model("Appointment", appointmentSchema)
