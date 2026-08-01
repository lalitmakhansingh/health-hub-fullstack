const express = require("express")
const router = express.Router()
const requireAuth = require("../middleware/auth")
const { getAppointments, createAppointment } = require("../controllers/appointmentController")

// Every route here requires a valid session
router.use(requireAuth)

router.get("/", getAppointments)
router.post("/", createAppointment)

module.exports = router
