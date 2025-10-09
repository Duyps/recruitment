import { useState } from "react";
import { useNavigate } from "react-router-dom";
import HeaderLanding from "./landingPage/HeaderLanding";
import "./home.css";

export default function HomePage() {
  const [selectedRole, setSelectedRole] = useState(null);
  const navigate = useNavigate();

  const handleConfirm = () => {
    if (selectedRole === "candidate") {
      navigate("/candidate/login");
    } else if (selectedRole === "company") {
      navigate("/company/login");
    }
  };

  return (
    <div className="homepage">
      <HeaderLanding />

      <h1>Join as a Company or Candidate</h1>

      <div className="button-group">
        <button
          className={`role-btn ${selectedRole === "candidate" ? "selected" : ""}`}
          onClick={() => setSelectedRole("candidate")}
        >
          I'm a candidate, looking for work.
        </button>

        <button
          className={`role-btn ${selectedRole === "company" ? "selected" : ""}`}
          onClick={() => setSelectedRole("company")}
        >
          I'm an employer, hiring for a job.
        </button>
      </div>

      {selectedRole && (
        <div className="confirm-section">
          <button className="confirm-btn" onClick={handleConfirm}>
            {selectedRole === "company" ? "Join as a Company" : "Apply as a Candidate"}
          </button>
        </div>
      )}

      <p className="login-text">
        Already have an account?{" "}
        <span className="login-link" onClick={() => navigate("/get-started")}>
          Log In
        </span>
      </p>
    </div>
  );
}
