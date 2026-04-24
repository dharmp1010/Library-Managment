// =============================================
// pages/BooksPage.jsx - Books List + Add/Edit/Delete
// =============================================

import { useState, useEffect, useCallback } from "react";
import api from "../api/axios";
import Alert from "../components/Alert";

function BooksPage({ isAdmin }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [alert, setAlert] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editBook, setEditBook] = useState(null); // null = add mode, object = edit mode

  // Form state
  const [form, setForm] = useState({ title: "", author: "", quantity: 1 });
  const [formLoading, setFormLoading] = useState(false);

  // Fetch books from API
  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/books", {
        params: search ? { search } : {},
      });
      setBooks(res.data);
    } catch (err) {
      setAlert({ type: "error", message: "Failed to load books." });
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  // Open form for Add
  const handleAddClick = () => {
    setEditBook(null);
    setForm({ title: "", author: "", quantity: 1 });
    setShowForm(true);
  };

  // Open form for Edit
  const handleEditClick = (book) => {
    setEditBook(book);
    setForm({ title: book.title, author: book.author, quantity: book.quantity });
    setShowForm(true);
  };

  // Submit Add or Edit
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      if (editBook) {
        // Edit existing book
        await api.put(`/books/${editBook._id}`, form);
        setAlert({ type: "success", message: "Book updated successfully!" });
      } else {
        // Add new book
        await api.post("/books", form);
        setAlert({ type: "success", message: "Book added successfully!" });
      }
      setShowForm(false);
      fetchBooks();
    } catch (err) {
      setAlert({
        type: "error",
        message: err.response?.data?.message || "Operation failed.",
      });
    } finally {
      setFormLoading(false);
    }
  };

  // Delete a book
  const handleDelete = async (book) => {
    if (!window.confirm(`Delete "${book.title}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/books/${book._id}`);
      setAlert({ type: "success", message: "Book deleted." });
      fetchBooks();
    } catch (err) {
      setAlert({
        type: "error",
        message: err.response?.data?.message || "Delete failed.",
      });
    }
  };

  // Quantity badge helper
  const qtyBadge = (qty) => {
    if (qty === 0) return <span className="qty-chip qty-zero">Out of Stock</span>;
    if (qty <= 2) return <span className="qty-chip qty-low">⚠ {qty}</span>;
    return <span className="qty-chip qty-ok">✓ {qty}</span>;
  };

  return (
    <div>
      <div className="page-title">
        <h2>Books Collection</h2>
        <p>Manage all library books — add, edit, search, or remove entries.</p>
      </div>

      {alert && (
        <Alert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />
      )}

      {/* Add/Edit Form Panel */}
      {showForm && isAdmin && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">{editBook ? "✏️ Edit Book" : "➕ Add New Book"}</h3>
            <button className="btn btn-outline btn-sm" onClick={() => setShowForm(false)}>
              Cancel
            </button>
          </div>
          <form onSubmit={handleFormSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Title</label>
                <input
                  className="form-input"
                  placeholder="e.g. The Great Gatsby"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Author</label>
                <input
                  className="form-input"
                  placeholder="e.g. F. Scott Fitzgerald"
                  value={form.author}
                  onChange={(e) => setForm({ ...form, author: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="form-group" style={{ maxWidth: 180 }}>
              <label className="form-label">Quantity</label>
              <input
                type="number"
                className="form-input"
                min="0"
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: parseInt(e.target.value) || 0 })}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={formLoading}>
              {formLoading ? "Saving..." : editBook ? "Update Book" : "Add Book"}
            </button>
          </form>
        </div>
      )}

      {/* Search + Add Button */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">All Books ({books.length})</h3>
          {isAdmin && !showForm && (
            <button className="btn btn-accent" onClick={handleAddClick}>
              ＋ Add Book
            </button>
          )}
        </div>

        {/* Search Bar */}
        <div className="search-bar">
          <input
            className="form-input"
            placeholder="🔍  Search by title or author..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="btn btn-outline" onClick={() => setSearch("")}>
              Clear
            </button>
          )}
        </div>

        {/* Books Table */}
        {loading ? (
          <p style={{ color: "var(--text-muted)", padding: "20px 0" }}>Loading books...</p>
        ) : books.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📭</div>
            <p>{search ? "No books match your search." : "No books added yet."}</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Available Qty</th>
                  {isAdmin && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {books.map((book, idx) => (
                  <tr key={book._id}>
                    <td style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>{idx + 1}</td>
                    <td><strong>{book.title}</strong></td>
                    <td>{book.author}</td>
                    <td>{qtyBadge(book.quantity)}</td>
                    {isAdmin && (
                      <td>
                        <div style={{ display: "flex", gap: 6 }}>
                          <button
                            className="btn btn-outline btn-sm"
                            onClick={() => handleEditClick(book)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(book)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default BooksPage;
