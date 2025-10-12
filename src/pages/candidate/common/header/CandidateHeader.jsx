import { useNavigate } from "react-router-dom";
import './header.css';
import logo from "../../../../assets/logo.png";
export default function CandidateHeader() {
  const navigate = useNavigate();

  return (
    <header className="candidate-header">
      <div className="header-left">
        {/*<img
          src={logo}
          alt="Logo"
          className="header-logo"
          onClick={() => navigate("/candidate/home")}
        />*/}
        <p>Logo Ở đây</p>
        <button onClick={() => navigate("/candidate/home")}>Home</button>
        <button onClick={() => navigate("/candidate/company-review")}>
          Company Review
        </button>
      </div>

      <nav className="header-nav">
        
        <button onClick={() => navigate("/candidate/home/saved-jobs")}>
          Saved Job
        </button>
        <button onClick={() => navigate("/candidate/home/account")}>Account</button>
      </nav>
    </header>
  );
}
