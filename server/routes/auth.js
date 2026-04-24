// =============================================
// routes/auth.js - Admin Login Route
// =============================================

const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

// POST /api/auth/login - Admin login
// Uses a single hardcoded admin (no user registration needed)
router.post("/login", (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ message: "Password is required." });
  }

  // Simple password check against .env value
  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ message: "Invalid password." });
  }

  // Create JWT token valid for 8 hours
  const token = jwt.sign({ role: "admin" }, process.env.JWT_SECRET, {
    expiresIn: "8h",
  });

  res.json({ token, message: "Login successful!" });
});

module.exports = router;
