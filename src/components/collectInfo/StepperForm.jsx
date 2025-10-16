// File: StepperForm.jsx (Đã thiết kế lại)

import { useState } from "react";
import { FiArrowLeft, FiArrowRight, FiCheck } from "react-icons/fi";
import "./form.css";

// Tổng số bước
const TOTAL_STEPS = 6;

export default function StepperForm({ formData, onChange, onFinish }) {
  const [step, setStep] = useState(1);

  const next = () => {
        // Có thể thêm logic kiểm tra dữ liệu ở đây trước khi chuyển bước
        setStep((s) => s + 1);
    };
  const back = () => setStep((s) => s - 1);
  const skip = () => next(); // Giữ nguyên chức năng skip

  // Dữ liệu tiêu đề các bước
  const stepTitles = [
    "Thông tin cơ bản",
    "Liên hệ",
    "Học vấn",
    "Kinh nghiệm làm việc",
    "Kỹ năng",
    "Mục tiêu nghề nghiệp",
  ];

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="step-content-grid"> {/* Thẻ bọc mới */}
            <input
              placeholder="Họ và tên"
              value={formData.fullName}
              onChange={(e) => onChange("fullName", e.target.value)}
            />
            <input
              placeholder="Năm sinh"
              type="number"
              value={formData.birthYear}
              onChange={(e) => onChange("birthYear", e.target.value)}
            />
            <select
              value={formData.gender}
              onChange={(e) => onChange("gender", e.target.value)}
            >
              <option value="">Giới tính</option>
              <option>Nam</option>
              <option>Nữ</option>
              <option>Khác</option>
            </select>
          </div>
        );

      case 2:
        return (
          <div className="step-content-grid">
            <input
              placeholder="Số điện thoại"
              type="tel"
              value={formData.phone}
              onChange={(e) => onChange("phone", e.target.value)}
            />
            <input
              placeholder="Địa chỉ (thành phố, quốc gia)"
              value={formData.address}
              onChange={(e) => onChange("address", e.target.value)}
            />
          </div>
        );

      case 3:
        return (
          <div className="step-content-grid">
            <input
              placeholder="Trình độ học vấn (VD: Đại học, Cao đẳng)"
              value={formData.education}
              onChange={(e) => onChange("education", e.target.value)}
            />
            <input
              placeholder="Chuyên ngành"
              value={formData.major}
              onChange={(e) => onChange("major", e.target.value)}
            />
            <input
              placeholder="Năm tốt nghiệp"
              type="number"
              value={formData.graduationYear}
              onChange={(e) => onChange("graduationYear", e.target.value)}
            />
          </div>
        );

      case 4:
        return (
          <div className="step-content-grid">
            <input
              placeholder="Số năm kinh nghiệm"
              type="number"
              value={formData.experienceYears}
              onChange={(e) => onChange("experienceYears", e.target.value)}
            />
            <input
              placeholder="Vị trí gần đây nhất"
              value={formData.lastPosition}
              onChange={(e) => onChange("lastPosition", e.target.value)}
            />
            <input
              placeholder="Công ty gần đây nhất"
              value={formData.lastCompany}
              onChange={(e) => onChange("lastCompany", e.target.value)}
            />
          </div>
        );

      case 5:
        return (
          <div className="step-content-grid">
            <textarea /* Thay input bằng textarea cho kỹ năng để dễ nhập nhiều dòng */
              placeholder="Nhập kỹ năng, cách nhau bởi dấu phẩy hoặc xuống dòng"
              value={formData.skills.join(", ")}
              onChange={(e) =>
                onChange(
                  "skills",
                  e.target.value.split(/,?\s*[\n,]\s*/).filter(s => s.trim() !== '').map((s) => s.trim()) // Xử lý cả dấu phẩy và xuống dòng
                )
              }
              rows="5"
            />
          </div>
        );

      case 6:
        return (
          <div className="step-content-grid">
            <textarea 
              placeholder="Mục tiêu nghề nghiệp"
              value={formData.careerGoal}
              onChange={(e) => onChange("careerGoal", e.target.value)}
              rows="3"
            />
            <input
              placeholder="Mức lương mong muốn (VNĐ)"
              type="number"
              value={formData.expectedSalary}
              onChange={(e) => onChange("expectedSalary", e.target.value)}
            />
            <select
              value={formData.workType}
              onChange={(e) => onChange("workType", e.target.value)}
            >
              <option value="">Hình thức làm việc</option>
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Remote</option>
            </select>
          </div>
        );

      default:
        return <p className="finish-message">🎉 Đã hoàn tất! Nhấn "Finish" để lưu hồ sơ của bạn.</p>;
    }
  };

  return (
    <div className="stepper-form">
      {/* THANH TIẾN TRÌNH MỚI */}
      <div className="progress-bar-container">
        <div className="progress-bar-track">
          <div
            className="progress-bar-fill"
            style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
          ></div>
        </div>
        <p className="step-indicator">Step {step} / {TOTAL_STEPS}</p>
      </div>

      {/* TIÊU ĐỀ BƯỚC MỚI */}
      <h3 className="step-title">
        <span className="step-number">Step {step}:</span> {stepTitles[step - 1]}
      </h3>

      {/* NỘI DUNG BƯỚC */}
      {renderStepContent()}

      <div className="stepper-buttons">
        {step > 1 && (
          <button className="btn-back" onClick={back}>
            <FiArrowLeft /> Back
          </button>
        )}
        
        {/* Đặt button next/skip ở bên phải */}
        <div className="right-controls"> 
          {step < TOTAL_STEPS && (
            <div className="btn-group">
                <button className="btn-skip" onClick={skip}>
                    Skip
                </button>
                <button className="btn-next" onClick={next}>
                    Next <FiArrowRight />
                </button>
            </div>
          )}
          {step === TOTAL_STEPS && (
            <button className="btn-finish" onClick={onFinish}>
                <FiCheck /> Finish Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
}