// =============================================
// components/Navbar.jsx - Navigation Bar
// =============================================

function Navbar({ activePage, setActivePage, isAdmin, onLogout }) {
  const tabs = [
    { id: "books", label: "📚 Books" },
    { id: "users", label: "👤 Users" },
    { id: "issues", label: "📋 Issued" },
    { id: "history", label: "🕑 History" },
  ];

  return (
    <nav className="navbar">
      {/* Brand */}
      <div className="navbar-brand">
        <span>📖</span>
        LibraryMS
      </div>

      {/* Navigation Tabs */}
      <div className="navbar-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`nav-tab ${activePage === tab.id ? "active" : ""}`}
            onClick={() => setActivePage(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Admin Status */}
      <div className="navbar-right">
        {isAdmin ? (
          <>
            <span className="admin-badge">Admin</span>
            <button className="btn-logout" onClick={onLogout}>
              Logout
            </button>
          </>
        ) : (
          <button
            className="nav-tab"
            onClick={() => setActivePage("login")}
          >
            🔐 Admin Login
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
