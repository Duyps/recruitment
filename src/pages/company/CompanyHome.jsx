import { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { FiPlus, FiBriefcase, FiUser } from "react-icons/fi";
import "./company.css";
import CompanyProfile from "./manageProfile/CompanyProfile";

export default function CompanyHome() {
  const [company, setCompany] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
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
      if (snap.exists()) {
        setCompany(snap.data());
        setFormData(snap.data());
      }
    };
    fetchCompany();
  }, [navigate]);

  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user) return;
    const ref = doc(db, "companies", user.uid);
    await updateDoc(ref, formData);
    setEditing(false);
    setCompany(formData);
    alert("✅ Company info updated!");
  };

  if (!company) return <p className="p-10 text-gray-500">Loading...</p>;

  return (
    <div className="company-container">
      {/* === Sidebar === */}
      <aside className="sidebar">
        <h2>Company Dashboard</h2>

        <nav>
          <button
            onClick={() => setActiveTab("create")}
            className={activeTab === "create" ? "active" : ""}
          >
            <FiPlus /> Create New
          </button>

          <button
            onClick={() => setActiveTab("jobs")}
            className={activeTab === "jobs" ? "active" : ""}
          >
            <FiBriefcase /> Jobs
          </button>

          <button
            onClick={() => setActiveTab("profile")}
            className={activeTab === "profile" ? "active" : ""}
          >
            <FiUser /> Profile
          </button>
        </nav>
      </aside>

      {/* === Main Content === */}
      <main className="main-content">
        {activeTab === "profile" && (
          <CompanyProfile
            company={company}
            editing={editing}
            formData={formData}
            setFormData={setFormData}
            setEditing={setEditing}
            handleSave={handleSave}
          />
        )}

        {activeTab === "create" && (
          <div className="placeholder-section">
            <h2>Create New Job</h2>
            <p>This section allows you to post a new job listing.</p>
          </div>
        )}

        {activeTab === "jobs" && (
          <div className="placeholder-section">
            <h2>Manage Jobs</h2>
            <p>View and manage all your posted jobs here.</p>
          </div>
        )}
      </main>
    </div>
  );
}
