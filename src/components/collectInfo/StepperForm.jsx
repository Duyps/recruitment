import { useState } from "react";

export default function StepperForm({ formData, onChange, onFinish }) {
  const [step, setStep] = useState(1);

  const next = () => setStep((s) => s + 1);
  const back = () => setStep((s) => s - 1);
  const skip = () => next();

  // Mỗi bước là 1 nhóm thông tin
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <h3>Step 1: Thông tin cơ bản</h3>
            <input
              placeholder="Họ và tên"
              value={formData.fullName}
              onChange={(e) => onChange("fullName", e.target.value)}
            /><br />
            <input
              placeholder="Năm sinh"
              value={formData.birthYear}
              onChange={(e) => onChange("birthYear", e.target.value)}
            /><br />
            <select
              value={formData.gender}
              onChange={(e) => onChange("gender", e.target.value)}
            >
              <option value="">Giới tính</option>
              <option>Nam</option>
              <option>Nữ</option>
              <option>Khác</option>
            </select>
          </>
        );
      case 2:
        return (
          <>
            <h3>Step 2: Liên hệ</h3>
            <input
              placeholder="Số điện thoại"
              value={formData.phone}
              onChange={(e) => onChange("phone", e.target.value)}
            /><br />
            <input
              placeholder="Địa chỉ (thành phố, quốc gia)"
              value={formData.address}
              onChange={(e) => onChange("address", e.target.value)}
            />
          </>
        );
      case 3:
        return (
          <>
            <h3>Step 3: Học vấn</h3>
            <input
              placeholder="Trình độ học vấn"
              value={formData.education}
              onChange={(e) => onChange("education", e.target.value)}
            /><br />
            <input
              placeholder="Chuyên ngành"
              value={formData.major}
              onChange={(e) => onChange("major", e.target.value)}
            /><br />
            <input
              placeholder="Năm tốt nghiệp"
              value={formData.graduationYear}
              onChange={(e) => onChange("graduationYear", e.target.value)}
            />
          </>
        );
      case 4:
        return (
          <>
            <h3>Step 4: Kinh nghiệm làm việc</h3>
            <input
              placeholder="Số năm kinh nghiệm"
              value={formData.experienceYears}
              onChange={(e) => onChange("experienceYears", e.target.value)}
            /><br />
            <input
              placeholder="Vị trí gần đây nhất"
              value={formData.lastPosition}
              onChange={(e) => onChange("lastPosition", e.target.value)}
            /><br />
            <input
              placeholder="Công ty gần đây nhất"
              value={formData.lastCompany}
              onChange={(e) => onChange("lastCompany", e.target.value)}
            />
          </>
        );
      case 5:
        return (
          <>
            <h3>Step 5: Kỹ năng</h3>
            <input
              placeholder="Nhập kỹ năng, cách nhau bởi dấu phẩy"
              value={formData.skills.join(", ")}
              onChange={(e) =>
                onChange("skills", e.target.value.split(",").map((s) => s.trim()))
              }
            />
          </>
        );
      case 6:
        return (
          <>
            <h3>Step 6: Mục tiêu nghề nghiệp</h3>
            <input
              placeholder="Mục tiêu nghề nghiệp"
              value={formData.careerGoal}
              onChange={(e) => onChange("careerGoal", e.target.value)}
            /><br />
            <input
              placeholder="Mức lương mong muốn (VNĐ)"
              value={formData.expectedSalary}
              onChange={(e) => onChange("expectedSalary", e.target.value)}
            /><br />
            <select
              value={formData.workType}
              onChange={(e) => onChange("workType", e.target.value)}
            >
              <option value="">Hình thức làm việc</option>
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Remote</option>
            </select>
          </>
        );
      default:
        return <p>Hoàn tất!</p>;
    }
  };

  return (
    <div style={{
      background: "#fff",
      padding: "30px 40px",
      borderRadius: 12,
      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
      width: "350px",
      textAlign: "center"
    }}>
      {renderStep()}

      <div style={{ marginTop: 20, display: "flex", justifyContent: "space-between" }}>
        {step > 1 && <button onClick={back}>⬅ Back</button>}
        {step < 6 && (
          <>
            <button onClick={skip}>Skip</button>
            <button onClick={next}>Next ➡</button>
          </>
        )}
        {step === 6 && <button onClick={onFinish}>Finish ✅</button>}
      </div>

      <p style={{ marginTop: 10 }}>Step {step} / 6</p>
    </div>
  );
}
