import { useState } from "react";
import { auth, db } from "../../firebase";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import './company.css';

export default function CompanySetup() {
  const [step, setStep] = useState(1);
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

  const handleChange = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const next = () => setStep((s) => Math.min(s + 1, 4));
  const back = () => setStep((s) => Math.max(s - 1, 1));

  const handleSave = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return alert("User not logged in!");

      const companyRef = doc(db, "companies", user.uid);
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

  // ==============================
  // 🧩 Nội dung từng bước nhập form
  // ==============================
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <h3>Step 1: Company Basics 🏢</h3>
            <input
              placeholder="Company Name"
              value={formData.companyName}
              onChange={(e) => handleChange("companyName", e.target.value)}
            />
            <input
              placeholder="Industry"
              value={formData.industry}
              onChange={(e) => handleChange("industry", e.target.value)}
            />
            <input
              placeholder="Company Size (e.g. 50-200 employees)"
              value={formData.companySize}
              onChange={(e) => handleChange("companySize", e.target.value)}
            />
            <input
              placeholder="Founded Year"
              value={formData.foundedYear}
              onChange={(e) => handleChange("foundedYear", e.target.value)}
            />
          </>
        );

      case 2:
        return (
          <>
            <h3>Step 2: Contact Information ☎️</h3>
            <input
              placeholder="Address"
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
            />
            <input
              placeholder="Phone Number"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
            <input
              placeholder="Email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
            <input
              placeholder="Website"
              value={formData.website}
              onChange={(e) => handleChange("website", e.target.value)}
            />
          </>
        );

      case 3:
        return (
          <>
            <h3>Step 3: Description & Recruiter 👤</h3>
            <textarea
              placeholder="Company Description"
              rows={4}
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
            />
            <input
              placeholder="Recruiter Name"
              value={formData.recruiterName}
              onChange={(e) => handleChange("recruiterName", e.target.value)}
            />
            <input
              placeholder="Recruiter Position"
              value={formData.recruiterPosition}
              onChange={(e) => handleChange("recruiterPosition", e.target.value)}
            />
          </>
        );

      case 4:
        return (
          <>
            <h3>Step 4: Review & Confirm ✅</h3>
            <div className="review-box">
              {Object.entries(formData).map(([key, value]) => (
                <p key={key}>
                  <strong>{key.replace(/([A-Z])/g, " $1")}:</strong>{" "}
                  {value || <em>Not provided</em>}
                </p>
              ))}
            </div>
            <button className="btn-primary" onClick={handleSave}>
              Save Company Profile
            </button>
          </>
        );

      default:
        return null;
    }
  };

  // ==============================
  // 🔲 Giao diện tổng thể form
  // ==============================
  return (
    <div className="form-wrapper" style={{ maxWidth: "550px" }}>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${(step / 4) * 100}%` }} />
      </div>

      {renderStep()}

      {step < 4 && (
        <div className="btn-row">
          {step > 1 && (
            <button className="btn-secondary" onClick={back}>
              ⬅ Back
            </button>
          )}
          <button className="btn-primary" onClick={next}>
            Next ➡
          </button>
        </div>
      )}

      <p className="step-text">Step {step} / 4</p>
    </div>
  );
}
