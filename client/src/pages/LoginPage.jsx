// =============================================
// pages/LoginPage.jsx - Admin Login
// =============================================

import { useState } from "react";
import api from "../api/axios";
import Alert from "../components/Alert";

function LoginPage({ onLogin }) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);

    try {
      const res = await api.post("/auth/login", { password });
      // Save token in localStorage for future requests
      localStorage.setItem("token", res.data.token);
      onLogin(); // notify App component
    } catch (err) {
      setAlert({
        type: "error",
        message: err.response?.data?.message || "Login failed.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-icon">📖</div>
        <h2 className="login-title">LibraryMS</h2>
        <p className="login-subtitle">Admin Login — Default password: admin123</p>

        {alert && (
          <Alert
            message={alert.message}
            type={alert.type}
            onClose={() => setAlert(null)}
          />
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ textAlign: "left" }}>
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: "100%", justifyContent: "center" }}
          >
            {loading ? "Logging in..." : "Login as Admin"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
