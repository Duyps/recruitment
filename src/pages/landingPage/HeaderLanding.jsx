import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./header.css";

export default function HeaderLanding() {
  const location = useLocation();
  const isLandingPage = location.pathname === "/"; // ✅ kiểm tra đang ở trang landing

  return (
    <header className="header-landing">
      <Link to="/" className="logo">ITViec</Link>

      {isLandingPage && (
        <nav className="nav-links">
          <Link to="/get-started" className="nav-btn">
            Login
          </Link>
          <Link to="/homepage" className="nav-btn get-started">
            Get Started
          </Link>
        </nav>
      )}
    </header>
  );
}
