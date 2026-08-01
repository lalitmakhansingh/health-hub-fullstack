const express = require("express")
const router = express.Router()
const requireAuth = require("../middleware/auth")
const { getMedicines, createMedicine } = require("../controllers/medicineController")

router.use(requireAuth)

router.get("/", getMedicines)
router.post("/", createMedicine)

module.exports = router
