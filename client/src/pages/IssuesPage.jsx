// =============================================
// pages/IssuesPage.jsx - Issue Book + Active Issues + Return
// =============================================

import { useState, useEffect, useCallback } from "react";
import api from "../api/axios";
import Alert from "../components/Alert";

function IssuesPage({ isAdmin }) {
  const [issues, setIssues] = useState([]);
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ userId: "", bookId: "" });
  const [formLoading, setFormLoading] = useState(false);
  const [returningId, setReturningId] = useState(null); // track which issue is being returned

  // Fetch currently issued books
  const fetchIssues = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/issues");
      setIssues(res.data);
    } catch (err) {
      setAlert({ type: "error", message: "Failed to load issued books." });
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch books and users for the issue form dropdowns
  const fetchFormData = useCallback(async () => {
    try {
      const [booksRes, usersRes] = await Promise.all([
        api.get("/books"),
        api.get("/users"),
      ]);
      // Only show books with quantity > 0 in the dropdown
      setBooks(booksRes.data.filter((b) => b.quantity > 0));
      setUsers(usersRes.data);
    } catch (err) {
      console.error("Error loading form data:", err);
    }
  }, []);

  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);

  // Load dropdown data when form is opened
  useEffect(() => {
    if (showForm) fetchFormData();
  }, [showForm, fetchFormData]);

  // Issue a book
  const handleIssue = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      await api.post("/issues", form);
      setAlert({ type: "success", message: "Book issued successfully!" });
      setForm({ userId: "", bookId: "" });
      setShowForm(false);
      fetchIssues();
    } catch (err) {
      setAlert({
        type: "error",
        message: err.response?.data?.message || "Failed to issue book.",
      });
    } finally {
      setFormLoading(false);
    }
  };

  // Return a book
  const handleReturn = async (issueId, bookTitle) => {
    if (!window.confirm(`Confirm return of "${bookTitle}"?`)) return;
    setReturningId(issueId);
    try {
      await api.put(`/issues/${issueId}/return`);
      setAlert({ type: "success", message: "Book returned successfully!" });
      fetchIssues();
    } catch (err) {
      setAlert({
        type: "error",
        message: err.response?.data?.message || "Return failed.",
      });
    } finally {
      setReturningId(null);
    }
  };

  // Check if a book is overdue (past due date)
  const isOverdue = (dueDate) => new Date(dueDate) < new Date();

  // Format date nicely
  const fmtDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit", month: "short", year: "numeric",
    });

  return (
    <div>
      <div className="page-title">
        <h2>Issued Books</h2>
        <p>Track currently issued books and process returns.</p>
      </div>

      {alert && (
        <Alert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />
      )}

      {/* Issue Form */}
      {showForm && isAdmin && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">📤 Issue a Book</h3>
            <button className="btn btn-outline btn-sm" onClick={() => setShowForm(false)}>
              Cancel
            </button>
          </div>
          <form onSubmit={handleIssue}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Select User</label>
                <select
                  className="form-select"
                  value={form.userId}
                  onChange={(e) => setForm({ ...form, userId: e.target.value })}
                  required
                >
                  <option value="">-- Choose a user --</option>
                  {users.map((u) => (
                    <option key={u._id} value={u._id}>
                      {u.name} ({u.userId})
                    </option>
                  ))}
                </select>
                {users.length === 0 && (
                  <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: 4 }}>
                    No users found. Add users first.
                  </p>
                )}
              </div>
              <div className="form-group">
                <label className="form-label">Select Book</label>
                <select
                  className="form-select"
                  value={form.bookId}
                  onChange={(e) => setForm({ ...form, bookId: e.target.value })}
                  required
                >
                  <option value="">-- Choose a book --</option>
                  {books.map((b) => (
                    <option key={b._id} value={b._id}>
                      {b.title} — {b.author} (Qty: {b.quantity})
                    </option>
                  ))}
                </select>
                {books.length === 0 && (
                  <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: 4 }}>
                    No available books. All books are out of stock.
                  </p>
                )}
              </div>
            </div>
            <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: 14 }}>
              📅 Due date will be set to <strong>14 days</strong> from today.
            </p>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={formLoading || books.length === 0 || users.length === 0}
            >
              {formLoading ? "Issuing..." : "Issue Book"}
            </button>
          </form>
        </div>
      )}

      {/* Active Issues Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Currently Issued ({issues.length})</h3>
          {isAdmin && !showForm && (
            <button className="btn btn-accent" onClick={() => setShowForm(true)}>
              ＋ Issue a Book
            </button>
          )}
        </div>

        {loading ? (
          <p style={{ color: "var(--text-muted)", padding: "20px 0" }}>Loading...</p>
        ) : issues.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <p>No books are currently issued.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Book</th>
                  <th>Issued To</th>
                  <th>Issue Date</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  {isAdmin && <th>Action</th>}
                </tr>
              </thead>
              <tbody>
                {issues.map((issue, idx) => {
                  const overdue = isOverdue(issue.dueDate);
                  return (
                    <tr key={issue._id} className={overdue ? "overdue" : ""}>
                      <td style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>{idx + 1}</td>
                      <td>
                        <strong>{issue.bookId?.title}</strong>
                        <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                          {issue.bookId?.author}
                        </div>
                      </td>
                      <td>
                        {issue.userId?.name}
                        <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                          {issue.userId?.userId}
                        </div>
                      </td>
                      <td style={{ fontSize: "0.88rem" }}>{fmtDate(issue.issueDate)}</td>
                      <td style={{ fontSize: "0.88rem" }}>{fmtDate(issue.dueDate)}</td>
                      <td>
                        {overdue ? (
                          <span className="badge badge-danger">⚠ Overdue</span>
                        ) : (
                          <span className="badge badge-success">On Time</span>
                        )}
                      </td>
                      {isAdmin && (
                        <td>
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => handleReturn(issue._id, issue.bookId?.title)}
                            disabled={returningId === issue._id}
                          >
                            {returningId === issue._id ? "..." : "↩ Return"}
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default IssuesPage;
