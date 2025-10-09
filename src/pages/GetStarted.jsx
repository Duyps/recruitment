import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import HeaderLanding from "./landingPage/HeaderLanding";

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
    <HeaderLanding/>
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Welcome back</h2>
        <p style={styles.subtitle}>Log in to continue to ITWorks</p>

        <form onSubmit={handleLogin} style={styles.form}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,
              background: loading ? "#ccc" : "#007bff",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Logging in..." : "Get Started →"}
          </button>
        </form>

        <div style={styles.signupText}>
          Don’t have an account?{" "}
          <span
            style={styles.signupLink}
            onClick={() => navigate("/homepage")}
          >
            Sign Up
          </span>
        </div>
      </div>
    </div>
  </>
  );
  
}

const styles = {
  page: {
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #f8f9ff, #e3f2fd)",
    fontFamily: "'Inter', sans-serif",
  },
  card: {
    background: "white",
    border: "1px solid #ddd",
    borderRadius: "16px",
    padding: "40px 50px",
    width: "360px",
    boxShadow: "0 6px 20px rgba(0, 0, 0, 0.08)",
    textAlign: "center",
  },
  title: {
    fontSize: "1.8rem",
    fontWeight: "700",
    marginBottom: "10px",
    color: "#222",
  },
  subtitle: {
    color: "#555",
    marginBottom: "25px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  input: {
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #ccc",
    fontSize: "1rem",
    outline: "none",
    transition: "0.2s",
  },
  button: {
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    color: "#fff",
    fontWeight: "600",
    fontSize: "1rem",
    transition: "0.3s",
  },
  signupText: {
    marginTop: "20px",
    color: "#444",
    fontSize: "0.95rem",
  },
  signupLink: {
    color: "#007bff",
    fontWeight: "600",
    cursor: "pointer",
  },
};
