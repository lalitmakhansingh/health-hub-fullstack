const jwt = require("jsonwebtoken")
const { OAuth2Client } = require("google-auth-library")
const User = require("../models/User")

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

function generateToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" })
}

function setTokenCookie(res, token) {
  res.cookie("token", token, {
    httpOnly: true,
    secure: true, // required in production — sameSite:"none" cookies MUST be secure
    sameSite: "none", // required to allow the cookie to be sent cross-domain (Vercel → Render)
    maxAge: 7 * 24 * 60 * 60 * 1000,
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
  // IMPORTANT: these options must match setTokenCookie() exactly (httpOnly, secure, sameSite).
  // clearCookie only overwrites the existing cookie if its attributes match — otherwise the
  // browser treats this as a completely different cookie and the original one never gets cleared,
  // which is what was causing users to stay logged in after "logging out" and refreshing.
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  })
  res.json({ message: "Logged out" })
}

// POST /api/auth/google
exports.googleAuth = async (req, res) => {
  try {
    const { idToken } = req.body

    if (!idToken) {
      return res.status(400).json({ message: "Google ID token is required" })
    }

    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    })
    const payload = ticket.getPayload()
    const { sub: googleId, email, given_name, family_name } = payload

    let user = await User.findOne({ googleId })

    if (!user) {
      user = await User.findOne({ email })

      if (user) {
        user.googleId = googleId
        await user.save()
      } else {
        user = await User.create({
          firstName: given_name || "Google",
          lastName: family_name || "User",
          email,
          googleId,
        })
      }
    }

    const token = generateToken(user._id)
    setTokenCookie(res, token)

    res.json({
      user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email },
    })
  } catch (err) {
    res.status(401).json({ message: "Google sign-in failed", error: err.message })
  }
}

// Requires requireAuth middleware to have run first (sets req.userId)
exports.getMe = async (req, res) => {
  const user = await User.findById(req.userId).select("-password")
  if (!user) return res.status(404).json({ message: "User not found" })
  res.json({ user })
}