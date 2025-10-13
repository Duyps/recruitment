import { useState } from "react";
import { auth, db } from "../../firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import StepperForm from "../../components/collectInfo/StepperForm";

export default function CandidateSetup() {
  // Dữ liệu form nhiều bước
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

  // Xử lý khi user thay đổi input
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Lưu dữ liệu lên Firestore
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
        { merge: true } // merge = true giúp tạo mới hoặc cập nhật
      );

      alert("Profile saved successfully!");
      navigate("/candidate/home");
    } catch (error) {
      console.error("Error saving profile:", error);
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
        background: "#f9f9f9",
        flexDirection: "column",
        padding: "20px",
      }}
    >
      <h2 style={{ marginBottom: "20px" }}>Complete your profile 👨‍💻</h2>

      {/* StepperForm là form nhiều bước, bạn đã tạo */}
      <StepperForm
        formData={formData}
        onChange={handleChange}
        onFinish={handleSave}
      />
    </div>
  );
}
