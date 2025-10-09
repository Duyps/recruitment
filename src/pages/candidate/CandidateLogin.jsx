import { useState } from "react";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import { useNavigate } from "react-router-dom";

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
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f6fa",
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "2rem 3rem",
          borderRadius: "16px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          width: "350px",
          textAlign: "center",
        }}
      >
        <h2 style={{ marginBottom: "1rem" }}>🎯 Candidate Login</h2>

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />
          <button
            type="submit"
            style={{
              backgroundColor: "#007bff",
              color: "white",
              padding: "10px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Login
          </button>
        </form>

        <div style={{ marginTop: "15px" }}>
          <p style={{ fontSize: "14px" }}>
            Don’t have an account?{" "}
            <span
              onClick={() => navigate("/candidate/register")}
              style={{ color: "#007bff", cursor: "pointer", fontWeight: "bold" }}
            >
              Register
            </span>
          </p>
          <p
            onClick={() => navigate("/")}
            style={{
              fontSize: "13px",
              color: "#555",
              cursor: "pointer",
              marginTop: "5px",
            }}
          >
            ← Back to Home
          </p>
        </div>
      </div>
    </div>
  );
}
