// =============================================
// models/Issue.js - Book Issue/Return Schema
// =============================================

const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // reference to User collection
      required: [true, "User ID is required"],
    },
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book", // reference to Book collection
      required: [true, "Book ID is required"],
    },
    issueDate: {
      type: Date,
      default: Date.now,
    },
    dueDate: {
      type: Date,
      default: () => new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from today
    },
    returnDate: {
      type: Date,
      default: null, // null means book not yet returned
    },
    isReturned: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Issue", issueSchema);
