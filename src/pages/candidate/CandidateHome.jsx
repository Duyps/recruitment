import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";

export default function CandidateHome() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Welcome Candidate 🎉</h2>
      <p>You are now logged in!</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
