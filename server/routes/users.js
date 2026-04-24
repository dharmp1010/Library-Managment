// =============================================
// routes/users.js - User Routes
// =============================================

const express = require("express");
const router = express.Router();
const User = require("../models/User");
const auth = require("../middleware/auth");

// GET /api/users - Get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users: " + err.message });
  }
});

// POST /api/users - Add a new user (protected)
router.post("/", auth, async (req, res) => {
  try {
    const { name, userId } = req.body;

    if (!name || !userId) {
      return res.status(400).json({ message: "Name and User ID are required." });
    }

    // Check if userId already exists
    const existing = await User.findOne({ userId });
    if (existing) {
      return res.status(400).json({ message: "User ID already exists." });
    }

    const user = new User({ name, userId });
    await user.save();

    res.status(201).json({ message: "User added successfully!", user });
  } catch (err) {
    res.status(500).json({ message: "Error adding user: " + err.message });
  }
});

// DELETE /api/users/:id - Delete a user (protected)
router.delete("/:id", auth, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found." });

    res.json({ message: "User deleted successfully!" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting user: " + err.message });
  }
});

module.exports = router;
