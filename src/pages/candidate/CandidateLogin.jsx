import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";

export default function CandidateLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/candidate/home");
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Candidate Login</h2>
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required /><br />
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required /><br />
        <button type="submit">Login</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <p>
        Don’t have an account?{" "}
        <span style={{ color: "blue", cursor: "pointer" }} onClick={() => navigate("/candidate/register")}>
          Register
        </span>
      </p>
    </div>
  );
}
