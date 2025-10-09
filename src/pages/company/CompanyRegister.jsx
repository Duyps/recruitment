import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDocs, query, where, collection, serverTimestamp } from "firebase/firestore";

export default function CompanyRegister() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Kiểm tra xem email đã được dùng cho candidate chưa
      const q = query(collection(db, "users"), where("email", "==", email));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const existingUser = snapshot.docs[0].data();
        if (existingUser.role === "candidate") {
          alert("This email is already used for a Candidate account. Please use another email.");
          setLoading(false);
          return;
        }
      }

      // Tạo tài khoản mới
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        role: "company",
        createdAt: serverTimestamp(),
      });

      await setDoc(doc(db, "companies", user.uid), {
        email: user.email,
        setupCompleted: false,
        createdAt: serverTimestamp(),
      });

      alert("Company account created successfully!");
      navigate("/company/plan");
    } catch (error) {
      console.error("Registration failed:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
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
  form: { display: "flex", flexDirection: "column", gap: "12px", width: "300px" },
  input: { padding: "10px", borderRadius: "8px", border: "1px solid #ccc" },
  button: { background: "#28a745", color: "#fff", padding: "10px", borderRadius: "8px", cursor: "pointer", border: "none" },
};
