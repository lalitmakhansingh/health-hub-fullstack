const Medicine = require("../models/Medicine")

// GET /api/medicines
exports.getMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find({ user: req.userId }).sort({ startDate: -1 })
    res.json({ medicines })
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch medicines", error: err.message })
  }
}

// POST /api/medicines
exports.createMedicine = async (req, res) => {
  try {
    const { name, dosage, frequency, startDate, endDate } = req.body

    if (!name || !dosage || !frequency || !startDate || !endDate) {
      return res.status(400).json({ message: "All fields are required" })
    }

    const medicine = await Medicine.create({
      user: req.userId,
      name,
      dosage,
      frequency,
      startDate,
      endDate,
    })

    res.status(201).json({ medicine })
  } catch (err) {
    res.status(500).json({ message: "Failed to add medicine", error: err.message })
  }
}
