const jwt = require("jsonwebtoken")
const User = require("../models/User")

function generateToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" })
}

function setTokenCookie(res, token) {
  res.cookie("token", token, {
    httpOnly: true, // JS on the frontend can't read this — protects against XSS token theft
    secure: process.env.NODE_ENV === "production", // HTTPS only in production
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days, matches JWT expiry
  })
}

exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" })
    }
    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(409).json({ message: "An account with this email already exists" })
    }

    // Password gets hashed automatically by the pre-save hook on the model
    const user = await User.create({ firstName, lastName, email, password })

    const token = generateToken(user._id)
    setTokenCookie(res, token)

    res.status(201).json({
      user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email },
    })
  } catch (err) {
    res.status(500).json({ message: "Registration failed", error: err.message })
  }
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" })
    }

    const user = await User.findOne({ email })
    if (!user) {
      // Deliberately vague — don't reveal whether the email exists (prevents user enumeration)
      return res.status(401).json({ message: "Invalid email or password" })
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" })
    }

    const token = generateToken(user._id)
    setTokenCookie(res, token)

    res.json({
      user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email },
    })
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message })
  }
}

exports.logout = (req, res) => {
  res.clearCookie("token")
  res.json({ message: "Logged out" })
}

// Requires requireAuth middleware to have run first (sets req.userId)
exports.getMe = async (req, res) => {
  const user = await User.findById(req.userId).select("-password")
  if (!user) return res.status(404).json({ message: "User not found" })
  res.json({ user })
}
