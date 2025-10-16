import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {
  doc,
  setDoc,
  getDocs,
  query,
  where,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import './company.css';

export default function CompanyRegister() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const q = query(collection(db, "users"), where("email", "==", email));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const existingUser = snapshot.docs[0].data();
        if (existingUser.role === "candidate") {
          alert(
            "This email is already used for a Candidate account. Please use another email."
          );
          setLoading(false);
          return;
        }
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
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
      navigate("/company/setup");
    } catch (error) {
      console.error("Registration failed:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <h2>Company Registration</h2>
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
        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Register"}
        </button>
        <p>
          Already have an account?{" "}
          <span onClick={() => navigate("/company/login")}>Login</span>
        </p>
      </form>
    </div>
  );
}
