import { useState } from "react";
import { auth, db } from "../../firebase";
import { doc, updateDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function CompanySetup() {
  const [formData, setFormData] = useState({
    companyName: "",
    industry: "",
    companySize: "",
    address: "",
    phone: "",
    website: "",
    email: "",
    description: "",
    foundedYear: "",
    recruiterName: "",
    recruiterPosition: "",
  });

  const navigate = useNavigate();

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return alert("User not logged in!");

      const companyRef = doc(db, "companies", user.uid);

      // Dùng setDoc thay vì updateDoc để tự tạo document nếu chưa có
      await setDoc(companyRef, {
        ...formData,
        setupCompleted: true,
        createdAt: new Date(),
      });

      alert("Company profile saved successfully!");
      navigate("/company/home");
    } catch (error) {
      console.error("Error saving company:", error);
      alert("Error saving profile, please try again.");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "#f2f2f2",
        flexDirection: "column",
        padding: "20px",
      }}
    >
      <h2>Company Profile Setup 🏢</h2>
      <div
        style={{
          background: "#fff",
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          width: "100%",
          maxWidth: "600px",
        }}
      >
        <div className="form">
          {Object.keys(formData).map((key) => (
            <div key={key} style={{ marginBottom: "15px" }}>
              <label
                style={{ display: "block", fontWeight: "bold", marginBottom: "5px" }}
              >
                {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
              </label>
              <input
                type="text"
                value={formData[key]}
                onChange={(e) => handleChange(key, e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                }}
              />
            </div>
          ))}
        </div>
        <button
          onClick={handleSave}
          style={{
            marginTop: "20px",
            width: "100%",
            padding: "12px",
            background: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          Save Company Profile
        </button>
      </div>
    </div>
  );
}
