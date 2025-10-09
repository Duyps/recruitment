import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";

export default function CompanyLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    

    try {
      if (data.role !== "company") {
        alert("This account is registered as a Candidate. Please use the Candidate login.");
        await signOut(auth);
        return;
      }
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/company/plan");
    } catch (error) {
      alert("Login failed: " + error.message);
    }
  };

  return (
    <div className="auth-page">
      <h2>Company Login 🏢</h2>
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
