import { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate, NavLink, Outlet } from "react-router-dom";
import { FiPlus, FiBriefcase, FiUser, FiLogOut } from "react-icons/fi";
import "./company.css";

export default function CompanyHome() {
  const [company, setCompany] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompany = async () => {
      const user = auth.currentUser;
      if (!user) {
        navigate("/getStarted");
        return;
      }
      const ref = doc(db, "companies", user.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) setCompany(snap.data());
    };
    fetchCompany();
  }, [navigate]);

  if (!company) return <p className="p-10 text-gray-500">Loading...</p>;

  return (
    <div className="company-container">
      {/* === Sidebar === */}
      <aside className="sidebar">
        <h2>Company Dashboard</h2>

        <nav>
          <NavLink
            to="/company/home/create"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <FiPlus /> Create New
          </NavLink>

          <NavLink
            to="/company/home/jobs"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <FiBriefcase /> Jobs
          </NavLink>

          <NavLink
            to="/company/home/profile"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <FiUser /> Profile
          </NavLink>

          <button
            onClick={async () => {
              await auth.signOut();
              navigate("/");
            }}
            className="logout-btn"
          >
            <FiLogOut /> Logout
          </button>
        </nav>
      </aside>

      {/* === Main Content === */}
      <main className="main-content">
        {/* Hiển thị route con */}
        <Outlet context={{ company, setCompany }} />
      </main>
    </div>
  );
}
