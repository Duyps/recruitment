/*import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase";
import { serverTimestamp, doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function CompanyRegister() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        userType: "company",
        setupCompleted: false,
        createdAt: serverTimestamp(),
      });

      navigate("/company/plan");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="auth-page">
      <h2>Register Company Account 🏢</h2>
      <form onSubmit={handleRegister}>
        <input
          type="email"
          placeholder="Company Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password (min 6 chars)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Register</button>
        <p>
          Already have an account?{" "}
          <span onClick={() => navigate("/company/login")}>Login</span>
        </p>
      </form>
    </div>
  );
}
*/
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export default function CompanyRegister() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Tạo tài khoản Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Ghi thông tin chung vào "users"
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        role: "company",
        createdAt: serverTimestamp(),
      });

      // Ghi dữ liệu riêng cho "companies"
      await setDoc(doc(db, "companies", user.uid), {
        email: user.email,
        setupCompleted: false,
        createdAt: serverTimestamp(),
      });

      alert("Company account created!");
      navigate("/company/plan");
    } catch (error) {
      console.error("Registration failed:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page" style={styles.container}>
      <h2>Company Registration 🏢</h2>
      <form onSubmit={handleRegister} style={styles.form}>
        <input
          type="email"
          placeholder="Company Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Password (min 6 chars)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={styles.input}
        />
        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? "Creating..." : "Register"}
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    minHeight: "100vh",
    justifyContent: "center",
    background: "#f9f9f9",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    width: "300px",
  },
  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },
  button: {
    background: "#28a745",
    color: "#fff",
    padding: "10px",
    borderRadius: "8px",
    cursor: "pointer",
    border: "none",
  },
};
