// =============================================
// routes/issues.js - Book Issue & Return Routes
// =============================================

const express = require("express");
const router = express.Router();
const Issue = require("../models/Issue");
const Book = require("../models/Book");
const User = require("../models/User");
const auth = require("../middleware/auth");

// GET /api/issues - Get all issued books (not returned)
router.get("/", async (req, res) => {
  try {
    const issues = await Issue.find({ isReturned: false })
      .populate("userId", "name userId") // join user data
      .populate("bookId", "title author")  // join book data
      .sort({ issueDate: -1 });

    res.json(issues);
  } catch (err) {
    res.status(500).json({ message: "Error fetching issues: " + err.message });
  }
});

// GET /api/issues/history - Get all issue history (including returned)
router.get("/history", async (req, res) => {
  try {
    const issues = await Issue.find()
      .populate("userId", "name userId")
      .populate("bookId", "title author")
      .sort({ issueDate: -1 });

    res.json(issues);
  } catch (err) {
    res.status(500).json({ message: "Error fetching history: " + err.message });
  }
});

// POST /api/issues - Issue a book to a user (protected)
router.post("/", auth, async (req, res) => {
  try {
    const { userId, bookId } = req.body;

    if (!userId || !bookId) {
      return res.status(400).json({ message: "userId and bookId are required." });
    }

    // Check that user exists
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found." });

    // Check that book exists
    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: "Book not found." });

    // *** IMPORTANT: Cannot issue if quantity is 0 ***
    if (book.quantity <= 0) {
      return res.status(400).json({
        message: `"${book.title}" is currently out of stock.`,
      });
    }

    // Check if user already has this book
    const alreadyIssued = await Issue.findOne({
      userId,
      bookId,
      isReturned: false,
    });
    if (alreadyIssued) {
      return res.status(400).json({
        message: "This user already has this book issued.",
      });
    }

    // Create issue record
    const issue = new Issue({ userId, bookId });
    await issue.save();

    // Decrease book quantity by 1
    book.quantity -= 1;
    await book.save();

    // Populate and return issue data
    const populatedIssue = await Issue.findById(issue._id)
      .populate("userId", "name userId")
      .populate("bookId", "title author");

    res.status(201).json({
      message: `Book issued to ${user.name} successfully!`,
      issue: populatedIssue,
    });
  } catch (err) {
    res.status(500).json({ message: "Error issuing book: " + err.message });
  }
});

// PUT /api/issues/:id/return - Return a book (protected)
router.put("/:id/return", auth, async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (!issue) return res.status(404).json({ message: "Issue record not found." });

    if (issue.isReturned) {
      return res.status(400).json({ message: "Book already returned." });
    }

    // Mark as returned with today's date
    issue.returnDate = new Date();
    issue.isReturned = true;
    await issue.save();

    // Increase book quantity back by 1
    await Book.findByIdAndUpdate(issue.bookId, { $inc: { quantity: 1 } });

    res.json({ message: "Book returned successfully!", issue });
  } catch (err) {
    res.status(500).json({ message: "Error returning book: " + err.message });
  }
});

module.exports = router;
