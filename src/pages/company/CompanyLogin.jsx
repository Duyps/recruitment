import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import './company.css';

export default function CompanyLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Lấy thông tin user trong Firestore
    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);

    if (!snap.exists()) {
      alert("Account not found in user records.");
      await signOut(auth);
      return;
    }

    const data = snap.data(); // ⚠️ dòng này rất quan trọng

    if (data.role !== "company") {
      alert("This account is registered as a Candidate. Please use the Candidate login.");
      await signOut(auth);
      return;
    }

    navigate("/company/home");
  } catch (err) {
    console.error("Login failed:", err);
    alert("Login failed: " + err.message);
  }
};


  return (
    <div className="auth-page">
      <h2>Company Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Company Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
        <p>
          Don't have an account?{" "}
          <span onClick={() => navigate("/company/register")}>Register</span>
        </p>
      </form>
    </div>
  );
}
