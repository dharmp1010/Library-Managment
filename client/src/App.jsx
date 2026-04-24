// =============================================
// App.jsx - Root Component
// Handles page navigation and auth state
// =============================================

import { useState, useEffect } from "react";
import "./App.css";

import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import BooksPage from "./pages/BooksPage";
import UsersPage from "./pages/UsersPage";
import IssuesPage from "./pages/IssuesPage";
import HistoryPage from "./pages/HistoryPage";

function App() {
  // Track which page is shown
  const [activePage, setActivePage] = useState("books");
  // Admin login state (check localStorage for saved token)
  const [isAdmin, setIsAdmin] = useState(!!localStorage.getItem("token"));

  // When activePage is set to "login", redirect there
  // When already logged in, redirect away from login
  useEffect(() => {
    if (activePage === "login" && isAdmin) {
      setActivePage("books");
    }
  }, [activePage, isAdmin]);

  // Handle successful login
  const handleLogin = () => {
    setIsAdmin(true);
    setActivePage("books");
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAdmin(false);
    setActivePage("books");
  };

  // Show login page when navigated there
  if (activePage === "login") {
    return <LoginPage onLogin={handleLogin} />;
  }

  // Render the active page
  const renderPage = () => {
    switch (activePage) {
      case "books":
        return <BooksPage isAdmin={isAdmin} />;
      case "users":
        return <UsersPage isAdmin={isAdmin} />;
      case "issues":
        return <IssuesPage isAdmin={isAdmin} />;
      case "history":
        return <HistoryPage />;
      default:
        return <BooksPage isAdmin={isAdmin} />;
    }
  };

  return (
    <div className="app-container">
      {/* Top Navigation Bar */}
      <Navbar
        activePage={activePage}
        setActivePage={setActivePage}
        isAdmin={isAdmin}
        onLogout={handleLogout}
      />

      {/* Page Content */}
      <main className="main-content">
        {renderPage()}
      </main>

      {/* Simple Footer */}
      <footer style={{
        textAlign: "center",
        padding: "16px",
        borderTop: "1px solid var(--border)",
        color: "var(--text-muted)",
        fontSize: "0.8rem"
      }}>
        📖 Library Management System — College Project &nbsp;|&nbsp; MERN Stack
      </footer>
    </div>
  );
}

export default App;
