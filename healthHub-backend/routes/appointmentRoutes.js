const express = require("express")
const router = express.Router()
const requireAuth = require("../middleware/auth")
const { getAppointments, createAppointment, cancelAppointment, getAvailability, deleteAppointment, rescheduleAppointment } = require("../controllers/appointmentController")


// Every route here requires a valid session
router.use(requireAuth)

router.get("/availability", getAvailability)
router.get("/", getAppointments)
router.post("/", createAppointment)
router.patch("/:id/cancel", cancelAppointment)
router.patch("/:id/reschedule", rescheduleAppointment)
router.delete("/:id", deleteAppointment)

module.exports = router
