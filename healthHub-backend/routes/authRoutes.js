const express = require("express")
const router = express.Router()
const requireAuth = require("../middleware/auth")
const { register, login, logout, getMe } = require("../controllers/authController")

router.post("/register", register)
router.post("/login", login)
router.post("/logout", logout)
router.get("/me", requireAuth, getMe)

module.exports = router
