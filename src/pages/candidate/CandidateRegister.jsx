// File: CandidateRegister.jsx (Phiên bản đồng nhất thiết kế)

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDocs, query, where, collection, serverTimestamp } from "firebase/firestore";
import "./candidate.css"; // Giữ nguyên import CSS

export default function CandidateRegister() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ... (Giữ nguyên logic kiểm tra và tạo tài khoản) ...
      const q = query(collection(db, "users"), where("email", "==", email));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const existingUser = snapshot.docs[0].data();
        if (existingUser.role === "company") {
          alert("This email is already used for a Company account. Please use another email.");
          setLoading(false);
          return;
        }
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        role: "candidate",
        createdAt: serverTimestamp(),
      });

      await setDoc(doc(db, "candidates", user.uid), {
        email: user.email,
        setupCompleted: false,
        createdAt: serverTimestamp(),
      });

      alert("Candidate account created successfully!");
      navigate("/candidate/setup");
    } catch (error) {
      console.error("Registration failed:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    // 1. CONTAINER CHUNG: Đổi tên class để khớp với cấu trúc chung (như .candidate-login-page)
    <div className="candidate-login-page"> 
      
      {/* 2. CARD: Đổi tên class để khớp với card đăng nhập */}
      <div className="candidate-login-card"> 
        
        <h2>Candidate Registration </h2>

        {/* 3. FORM: Đổi tên class và input class để khớp */}
        <form onSubmit={handleRegister} className="candidate-login-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            // Sử dụng class chung cho input
          />
          <input
            type="password"
            placeholder="Password (min 6 chars)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            // Sử dụng class chung cho input
          />
          {/* Button không đổi class, ta sẽ dùng class .candidate-login-form button để styling */}
          <button type="submit" disabled={loading}> 
            {loading ? "Creating..." : "Register"}
          </button>
        </form>
        
        {/* 4. FOOTER: Thêm phần liên kết/footer để đồng nhất với trang Login */}
        <div className="candidate-login-footer">
          <p>
            Already have an account?{" "}
            <span onClick={() => navigate("/candidate/login")} className="link">
              Login
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