// src/pages/HomePage.jsx
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        background: "#f0f2f5",
        textAlign: "center",
        padding: "20px",
      }}
    >
      <h1 style={{ fontSize: "2.5rem", marginBottom: "10px" }}>
        Welcome to ITWorks 💼
      </h1>
      <p style={{ maxWidth: "600px", color: "#555", marginBottom: "40px" }}>
        A modern recruitment platform connecting talented candidates and
        innovative companies.
      </p>

      {/* Các nút điều hướng */}
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        <button
          style={btnStyle}
          onClick={() => navigate("/candidate/login")}
        >
          I'm a Candidate
        </button>

        <button
          style={btnStyle}
          onClick={() => navigate("/company/login")}
        >
          I'm a Company
        </button>

        {/* 🔹 Nút Get Started mới */}
        <button style={btnPrimary} onClick={() => navigate("/get-started")}>
          Get Started →
        </button>
      </div>
    </div>
  );
}

const btnStyle = {
  padding: "12px 24px",
  border: "1px solid #333",
  borderRadius: "8px",
  background: "white",
  cursor: "pointer",
  fontWeight: "600",
  transition: "0.2s",
};

const btnPrimary = {
  ...btnStyle,
  background: "#007bff",
  color: "white",
  border: "none",
};
