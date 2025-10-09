import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function GetStarted() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1️⃣ Đăng nhập bằng Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2️⃣ Lấy thông tin user trong collection "users"
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        alert("⚠️ User data not found in Firestore!");
        return;
      }

      const role = userDoc.data().role; // ✅ đúng field
      let setupCompleted = false;

      // 3️⃣ Kiểm tra setupCompleted trong collection riêng
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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        background: "#f5f6fa",
      }}
    >
      <h2>Welcome back 👋</h2>
      <p style={{ color: "#555", marginBottom: "20px" }}>
        Log in to continue to ITWorks
      </p>

      <form
        onSubmit={handleLogin}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          width: "320px",
          background: "white",
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <input
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "12px",
            borderRadius: "8px",
            background: loading ? "#ccc" : "#007bff",
            color: "white",
            border: "none",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          {loading ? "Logging in..." : "Get Started →"}
        </button>
      </form>
    </div>
  );
}

const inputStyle = {
  padding: "10px",
  border: "1px solid #ccc",
  borderRadius: "8px",
};
