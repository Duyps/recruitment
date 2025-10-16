import { useState } from "react";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import './candidate.css';

export default function CandidateLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Đăng nhập Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Lấy thông tin trong collection "users"
      const userRef = doc(db, "users", user.uid);
      const snap = await getDoc(userRef);

      if (!snap.exists()) {
        alert("⚠️ Account not found in user records.");
        await signOut(auth);
        return;
      }

      const data = snap.data();

      // Kiểm tra loại tài khoản
      if (data.role !== "candidate") {
        alert("❌ This account is registered as a Company. Please use the Company login.");
        await signOut(auth);
        return;
      }

      // Thành công → chuyển sang trang home
      navigate("/candidate/home");
    } catch (err) {
      alert("🚫 " + err.message);
    }
  };

  return (
    <div className="candidate-login-page">
      <div className="candidate-login-card">
        <h2>Candidate Login</h2>

        <form onSubmit={handleLogin} className="candidate-login-form">
          <input
            type="email"
            placeholder="Email"
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
        </form>

        <div className="candidate-login-footer">
          <p>
            Don’t have an account?{" "}
            <span onClick={() => navigate("/candidate/register")} className="link">
              Register
            </span>
          </p>
          <p onClick={() => navigate("/")} className="back-link">
            ← Back to Home
          </p>
        </div>
      </div>
    </div>
  );
}
