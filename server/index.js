// =============================================
// index.js - Main Server Entry Point
// Library Management System Backend
// =============================================

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ---- Middleware ----
app.use(cors()); // Allow cross-origin requests from React frontend
app.use(express.json()); // Parse incoming JSON bodies

// ---- Routes ----
const bookRoutes = require("./routes/books");
const userRoutes = require("./routes/users");
const issueRoutes = require("./routes/issues");
const authRoutes = require("./routes/auth");

app.use("/api/books", bookRoutes);
app.use("/api/users", userRoutes);
app.use("/api/issues", issueRoutes);
app.use("/api/auth", authRoutes);

// ---- Health Check ----
app.get("/", (req, res) => {
  res.json({ message: "Library Management System API is running!" });
});

// ---- Connect to MongoDB and Start Server ----
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/library_db";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });
