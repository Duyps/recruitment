import React from 'react'
import { Link } from "react-router-dom";
import './header.css'

function HeaderLanding() {
  return (
    <header className="header">
      <div className="logo">MyWeb</div>
      <nav className="nav-links">
        <Link to="/get-started" className="nav-btn">Login</Link>
        <Link to="/homepage" className="nav-btn get-started">Get Started</Link>
      </nav>
    </header>
  );
}

export default HeaderLanding