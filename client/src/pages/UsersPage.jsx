// =============================================
// pages/UsersPage.jsx - Users List + Add/Delete
// =============================================

import { useState, useEffect, useCallback } from "react";
import api from "../api/axios";
import Alert from "../components/Alert";

function UsersPage({ isAdmin }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", userId: "" });
  const [formLoading, setFormLoading] = useState(false);

  // Fetch all users
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/users");
      setUsers(res.data);
    } catch (err) {
      setAlert({ type: "error", message: "Failed to load users." });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Add a new user
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      await api.post("/users", form);
      setAlert({ type: "success", message: `User "${form.name}" added successfully!` });
      setForm({ name: "", userId: "" });
      setShowForm(false);
      fetchUsers();
    } catch (err) {
      setAlert({
        type: "error",
        message: err.response?.data?.message || "Failed to add user.",
      });
    } finally {
      setFormLoading(false);
    }
  };

  // Delete a user
  const handleDelete = async (user) => {
    if (!window.confirm(`Remove user "${user.name}" (${user.userId})?`)) return;
    try {
      await api.delete(`/users/${user._id}`);
      setAlert({ type: "success", message: "User removed." });
      fetchUsers();
    } catch (err) {
      setAlert({
        type: "error",
        message: err.response?.data?.message || "Delete failed.",
      });
    }
  };

  return (
    <div>
      <div className="page-title">
        <h2>Registered Users</h2>
        <p>View and manage library members.</p>
      </div>

      {alert && (
        <Alert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />
      )}

      {/* Add User Form */}
      {showForm && isAdmin && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">➕ Add New User</h3>
            <button className="btn btn-outline btn-sm" onClick={() => setShowForm(false)}>
              Cancel
            </button>
          </div>
          <form onSubmit={handleFormSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  className="form-input"
                  placeholder="e.g. Dhyey Shah"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">User / Enrollment ID</label>
                <input
                  className="form-input"
                  placeholder="e.g. STU2024001"
                  value={form.userId}
                  onChange={(e) => setForm({ ...form, userId: e.target.value })}
                  required
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary" disabled={formLoading}>
              {formLoading ? "Adding..." : "Add User"}
            </button>
          </form>
        </div>
      )}

      {/* Users Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">All Users ({users.length})</h3>
          {isAdmin && !showForm && (
            <button className="btn btn-accent" onClick={() => setShowForm(true)}>
              ＋ Add User
            </button>
          )}
        </div>

        {loading ? (
          <p style={{ color: "var(--text-muted)", padding: "20px 0" }}>Loading users...</p>
        ) : users.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">👤</div>
            <p>No users registered yet.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>User / Enrollment ID</th>
                  <th>Registered On</th>
                  {isAdmin && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {users.map((user, idx) => (
                  <tr key={user._id}>
                    <td style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>{idx + 1}</td>
                    <td><strong>{user.name}</strong></td>
                    <td>
                      <span className="badge badge-neutral">{user.userId}</span>
                    </td>
                    <td style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                      {new Date(user.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit", month: "short", year: "numeric"
                      })}
                    </td>
                    {isAdmin && (
                      <td>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(user)}
                        >
                          Remove
                        </button>
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

export default UsersPage;
