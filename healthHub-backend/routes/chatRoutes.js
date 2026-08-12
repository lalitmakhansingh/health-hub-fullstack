const express = require("express")
const router = express.Router()
const requireAuth = require("../middleware/auth")
const { sendMessage } = require("../controllers/chatController")

router.use(requireAuth)
router.post("/", sendMessage)

module.exports = router
