// =============================================
// routes/books.js - Book CRUD Routes
// =============================================

const express = require("express");
const router = express.Router();
const Book = require("../models/Book");
const auth = require("../middleware/auth");

// GET /api/books - Get all books (or search by title/author)
router.get("/", async (req, res) => {
  try {
    const { search } = req.query;

    let query = {};

    // If search param exists, filter by title or author (case-insensitive)
    if (search) {
      query = {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { author: { $regex: search, $options: "i" } },
        ],
      };
    }

    const books = await Book.find(query).sort({ createdAt: -1 });
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: "Error fetching books: " + err.message });
  }
});

// GET /api/books/:id - Get single book by ID
router.get("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found." });
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: "Error fetching book: " + err.message });
  }
});

// POST /api/books - Add a new book (protected)
router.post("/", auth, async (req, res) => {
  try {
    const { title, author, quantity } = req.body;

    // Basic validation
    if (!title || !author) {
      return res.status(400).json({ message: "Title and author are required." });
    }

    const book = new Book({ title, author, quantity: quantity || 1 });
    await book.save();

    res.status(201).json({ message: "Book added successfully!", book });
  } catch (err) {
    res.status(500).json({ message: "Error adding book: " + err.message });
  }
});

// PUT /api/books/:id - Update a book (protected)
router.put("/:id", auth, async (req, res) => {
  try {
    const { title, author, quantity } = req.body;

    const book = await Book.findByIdAndUpdate(
      req.params.id,
      { title, author, quantity },
      { new: true, runValidators: true } // return updated doc, run schema validators
    );

    if (!book) return res.status(404).json({ message: "Book not found." });

    res.json({ message: "Book updated successfully!", book });
  } catch (err) {
    res.status(500).json({ message: "Error updating book: " + err.message });
  }
});

// DELETE /api/books/:id - Delete a book (protected)
router.delete("/:id", auth, async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found." });

    res.json({ message: "Book deleted successfully!" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting book: " + err.message });
  }
});

module.exports = router;
