import { useState } from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <nav
      style={{
        background: "#2563eb",
        color: "white",
        padding: "15px 20px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            margin: 0,
          }}
        >
          🌊 RiverEye
        </h1>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            background: "transparent",
            border: "1px solid white",
            color: "white",
            padding: "7px 10px",
            borderRadius: "6px",
            fontSize: "20px",
            cursor: "pointer",
          }}
        >
          ☰
        </button>
      </div>

      {menuOpen && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            marginTop: "15px",
          }}
        >
          <Link style={linkStyle} to="/" onClick={() => setMenuOpen(false)}>
            Home
          </Link>

          <Link style={linkStyle} to="/about" onClick={() => setMenuOpen(false)}>
            About
          </Link>

          <Link style={linkStyle} to="/report" onClick={() => setMenuOpen(false)}>
            Report Pollution
          </Link>

          <Link style={linkStyle} to="/reports" onClick={() => setMenuOpen(false)}>
            Reports
          </Link>

          <Link style={linkStyle} to="/map" onClick={() => setMenuOpen(false)}>
            🗺️ Map
          </Link>

          {token && (
            <Link
              style={linkStyle}
              to="/dashboard"
              onClick={() => setMenuOpen(false)}
            >
              Dashboard
            </Link>
          )}

          {!token ? (
            <>
              <Link
                style={linkStyle}
                to="/login"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>

              <Link
                style={linkStyle}
                to="/register"
                onClick={() => setMenuOpen(false)}
              >
                Register
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              style={{
                background: "white",
                color: "#2563eb",
                border: "none",
                padding: "10px",
                borderRadius: "7px",
                fontWeight: "bold",
              }}
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
}

const linkStyle = {
  color: "white",
  textDecoration: "none",
  fontSize: "16px",
};

export default Navbar;