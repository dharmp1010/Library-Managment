// =============================================
// pages/HistoryPage.jsx - Full Issue/Return History
// =============================================

import { useState, useEffect, useCallback } from "react";
import api from "../api/axios";
import Alert from "../components/Alert";

function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  // Stats derived from history
  const totalIssued = history.length;
  const totalReturned = history.filter((h) => h.isReturned).length;
  const totalActive = history.filter((h) => !h.isReturned).length;
  const totalOverdue = history.filter(
    (h) => !h.isReturned && new Date(h.dueDate) < new Date()
  ).length;

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/issues/history");
      setHistory(res.data);
    } catch (err) {
      setAlert({ type: "error", message: "Failed to load history." });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const fmtDate = (date) =>
    date
      ? new Date(date).toLocaleDateString("en-IN", {
          day: "2-digit", month: "short", year: "numeric",
        })
      : "—";

  return (
    <div>
      <div className="page-title">
        <h2>Issue History</h2>
        <p>Complete log of all book transactions — issued and returned.</p>
      </div>

      {alert && (
        <Alert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />
      )}

      {/* Stats Row */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-number">{totalIssued}</div>
          <div className="stat-label">Total Issued</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-number">{totalReturned}</div>
          <div className="stat-label">Returned</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📤</div>
          <div className="stat-number">{totalActive}</div>
          <div className="stat-label">Active</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⚠️</div>
          <div className="stat-number" style={{ color: totalOverdue > 0 ? "var(--danger)" : "inherit" }}>
            {totalOverdue}
          </div>
          <div className="stat-label">Overdue</div>
        </div>
      </div>

      {/* History Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">All Transactions</h3>
        </div>

        {loading ? (
          <p style={{ color: "var(--text-muted)", padding: "20px 0" }}>Loading history...</p>
        ) : history.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🕑</div>
            <p>No transactions recorded yet.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Book</th>
                  <th>User</th>
                  <th>Issue Date</th>
                  <th>Due Date</th>
                  <th>Return Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item, idx) => {
                  const overdue = !item.isReturned && new Date(item.dueDate) < new Date();
                  return (
                    <tr key={item._id} className={overdue ? "overdue" : ""}>
                      <td style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>{idx + 1}</td>
                      <td>
                        <strong>{item.bookId?.title}</strong>
                        <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                          {item.bookId?.author}
                        </div>
                      </td>
                      <td>
                        {item.userId?.name}
                        <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                          {item.userId?.userId}
                        </div>
                      </td>
                      <td style={{ fontSize: "0.88rem" }}>{fmtDate(item.issueDate)}</td>
                      <td style={{ fontSize: "0.88rem" }}>{fmtDate(item.dueDate)}</td>
                      <td style={{ fontSize: "0.88rem" }}>{fmtDate(item.returnDate)}</td>
                      <td>
                        {item.isReturned ? (
                          <span className="badge badge-success">Returned</span>
                        ) : overdue ? (
                          <span className="badge badge-danger">Overdue</span>
                        ) : (
                          <span className="badge badge-warning">Active</span>
                        )}
                      </td>
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

export default HistoryPage;
