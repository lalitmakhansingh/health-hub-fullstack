const jwt = require("jsonwebtoken")

// Protects routes: reads the JWT from the httpOnly cookie, verifies it,
// and attaches the decoded user id to req.userId for controllers to use.
function requireAuth(req, res, next) {
  const token = req.cookies.token

  if (!token) {
    return res.status(401).json({ message: "Not authenticated" })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.userId = decoded.userId
    next()
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired session" })
  }
}

module.exports = requireAuth
