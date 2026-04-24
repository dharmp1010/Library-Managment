// =============================================
// models/User.js - User Schema
// =============================================

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "User name is required"],
      trim: true,
    },
    userId: {
      type: String,
      required: [true, "User ID is required"],
      unique: true, // no duplicate user IDs
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
