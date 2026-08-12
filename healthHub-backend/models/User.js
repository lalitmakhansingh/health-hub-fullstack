const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    // Password is required ONLY for accounts created via email/password signup.
    // Google-authenticated users never set a password.
    password: {
      type: String,
      required: function () {
        return !this.googleId
      },
      minlength: 8,
    },
    // Google's unique identifier for the user. unique + sparse means: must
    // be unique among users who HAVE one, but doesn't conflict with users
    // who don't (sparse excludes null/undefined from the uniqueness check).
    googleId: { type: String, unique: true, sparse: true },
  },
  { timestamps: true }
)

// Hash password before saving — runs automatically on .save(), not on .create() with raw updates
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next()
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

// Instance method to check a plaintext password against the stored hash
userSchema.methods.comparePassword = function (candidatePassword) {
  if (!this.password) return false // Google-only accounts have no password to compare against
  return bcrypt.compare(candidatePassword, this.password)
}

module.exports = mongoose.model("User", userSchema)
