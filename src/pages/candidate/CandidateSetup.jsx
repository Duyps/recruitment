import { useState } from "react";
import { auth, db } from "../../firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import StepperForm from "../../components/collectInfo/StepperForm";
import './candidate.css';

export default function CandidateSetup() {
  const [formData, setFormData] = useState({
    fullName: "",
    birthYear: "",
    gender: "",
    phone: "",
    address: "",
    education: [],
    major: "",
    graduationYear: "",
    experienceYears: "",
    lastPosition: "",
    lastCompany: "",
    skills: [],
    careerGoal: "",
    expectedSalary: "",
    workType: "",
  });

  const navigate = useNavigate();

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user) {
      alert("User not logged in!");
      return;
    }

    try {
      const userRef = doc(db, "candidates", user.uid);

      await setDoc(
        userRef,
        {
          ...formData,
          setupCompleted: true,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      alert("Profile saved successfully!");
      navigate("/candidate/home");
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Error saving profile, please try again.");
    }
  };

  return (
    <div className="candidate-setup-container">
      <h2 className="candidate-setup-title">Complete your profile</h2>

      {/* Form nhiều bước */}
      <StepperForm
        formData={formData}
        onChange={handleChange}
        onFinish={handleSave}
      />
    </div>
  );
}
