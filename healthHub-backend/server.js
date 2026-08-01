require("dotenv").config()
const express = require("express")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const connectDB = require("./config/db")

const authRoutes = require("./routes/authRoutes")
const appointmentRoutes = require("./routes/appointmentRoutes")
const medicineRoutes = require("./routes/medicineRoutes")

const app = express()

connectDB()

app.use(express.json())
app.use(cookieParser())
app.use(
  cors({
    origin: process.env.CLIENT_URL, // e.g. http://localhost:3000
    credentials: true, // required so the browser sends/receives the httpOnly cookie cross-origin
  })
)

app.get("/api/health", (req, res) => res.json({ status: "ok" }))

app.use("/api/auth", authRoutes)
app.use("/api/appointments", appointmentRoutes)
app.use("/api/medicines", medicineRoutes)

// Basic error handler — catches anything thrown that wasn't already handled in a controller
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: "Something went wrong" })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`HealthHub API running on port ${PORT}`))
