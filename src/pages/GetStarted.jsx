import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import HeaderLanding from "./landingPage/HeaderLanding";
import './home.css';

export default function GetStarted() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        alert("⚠️ User data not found in Firestore!");
        return;
      }

      const role = userDoc.data().role;
      let setupCompleted = false;

      if (role === "candidate") {
        const candidateRef = doc(db, "candidates", user.uid);
        const candidateSnap = await getDoc(candidateRef);
        if (candidateSnap.exists()) setupCompleted = candidateSnap.data().setupCompleted || false;
        if (!setupCompleted) navigate("/candidate/setup");
        else navigate("/candidate/home");
      } 
      else if (role === "company") {
        const companyRef = doc(db, "companies", user.uid);
        const companySnap = await getDoc(companyRef);
        if (companySnap.exists()) setupCompleted = companySnap.data().setupCompleted || false;
        if (!setupCompleted) navigate("/company/setup");
        else navigate("/company/home");
      } 
      else {
        alert("❌ Unknown user type!");
      }
    } 
    catch (err) {
      console.error("Login error:", err);
      alert("❌ " + err.message);
    } 
    finally {
      setLoading(false);
    }
  };

  return (
    <>
      <HeaderLanding />

      <div className="getstarted-page">
        <div className="getstarted-card">
          <h2>Welcome back</h2>
          <p>Log in to continue to ITWorks</p>

          <form onSubmit={handleLogin} className="getstarted-form">
            <input
              type="email"
              placeholder="Email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
            />

            <button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Get Started →"}
            </button>
          </form>

          <div className="signup-text">
            Don’t have an account?{" "}
            <span onClick={() => navigate("/homepage")} className="signup-link">
              Sign Up
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
