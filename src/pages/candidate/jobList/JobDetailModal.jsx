import React, { useEffect, useState } from "react";
import { auth, db } from "../../../firebase";
import {
  doc,
  setDoc,
  deleteDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { FiHeart, FiCheckCircle, FiUploadCloud } from "react-icons/fi";
import "./jobdetail.css"; // Đảm bảo file CSS này được cập nhật để hỗ trợ modal mới

// --- 1. Component ApplyPopup (Tạm thời tích hợp) ---
// Có thể tách ra file riêng nếu cần tái sử dụng
const ApplyPopup = ({ job, company, candidate, isApplying, onClose, onSubmit }) => {
  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const user = auth.currentUser;

  // Kiểm tra CV và đăng nhập
  const hasCV = candidate?.cvUrl;
  const isCandidateReady = user && hasCV;
  
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!isCandidateReady) {
        alert("Please log in and upload your CV/Resume to your profile first.");
        return;
    }
    setLoading(true);
    await onSubmit(coverLetter);
    setLoading(false);
  };

  if (!isApplying) return null;

  return (
    <div className="apply-modal-overlay" onClick={onClose}>
      <form className="apply-modal-content" onClick={(e) => e.stopPropagation()} onSubmit={handleFormSubmit}>
        <button type="button" className="close-btn" onClick={onClose}>×</button>
        
        <div className="modal-header">
            <h2>Apply for {job.title}</h2>
            <p>at {company?.name}</p>
        </div>

        <div className="modal-body">
            <h3>Your Application</h3>
            
            {/* CV Status */}
            <div className={`cv-status-box ${hasCV ? 'cv-ready' : 'cv-missing'}`}>
                {hasCV ? (
                    <>
                        <FiCheckCircle size={20} />
                        <p>Your CV is ready: <a href={candidate.cvUrl} target="_blank" rel="noopener noreferrer">View CV</a></p>
                    </>
                ) : (
                    <>
                        <FiUploadCloud size={20} />
                        <p>You need to upload your CV/Resume to your profile first.</p>
                    </>
                )}
            </div>

            {/* Cover Letter */}
            <label htmlFor="coverLetter">Cover Letter (Optional)</label>
            <textarea
                id="coverLetter"
                rows="6"
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                placeholder="Write a brief cover letter for the hiring manager..."
            />
        </div>

        <div className="modal-footer">
            <button 
                type="submit" 
                className="apply-btn" 
                disabled={loading || !isCandidateReady}
            >
                {loading ? "Submitting..." : `Submit Application`}
            </button>
            <button type="button" className="cancel-btn" onClick={onClose} disabled={loading}>
                Cancel
            </button>
        </div>
      </form>
    </div>
  );
};
// --------------------------------------------------

export default function JobDetailModal({ job, company, onClose }) {
  const [isSaved, setIsSaved] = useState(false);
  const [otherJobs, setOtherJobs] = useState([]);
  const [currentJob, setCurrentJob] = useState(job);
  const [currentCompany, setCurrentCompany] = useState(company);
  
  // 🆕 State mới cho tính năng Apply
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [candidateData, setCandidateData] = useState(null); // Lưu dữ liệu ứng viên

  const user = auth.currentUser;

  // 🆕 Kiểm tra Job đã được ứng tuyển chưa (Giúp UI hiển thị nút Apply đúng)
  const [hasApplied, setHasApplied] = useState(false);

  // Khi props job hoặc company thay đổi
  useEffect(() => {
    setCurrentJob(job);
    setCurrentCompany(company);
  }, [job, company]);

  // 🆕 Tải dữ liệu ứng viên & Kiểm tra trạng thái Apply
  useEffect(() => {
    const fetchData = async () => {
      if (!user || !currentJob) return;

      // 1. Lấy dữ liệu Ứng viên (để lấy cvUrl)
      const candidateRef = doc(db, "candidates", user.uid);
      const candidateSnap = await getDoc(candidateRef);
      if (candidateSnap.exists()) {
        setCandidateData(candidateSnap.data());
      } else {
        setCandidateData({});
      }
      
      // 2. Kiểm tra Job đã lưu
      const savedRef = doc(db, "candidates", user.uid, "savedJobs", currentJob.id);
      const savedSnap = await getDoc(savedRef);
      setIsSaved(savedSnap.exists());

      // 3. Kiểm tra Job đã được ứng tuyển
      const appliedRef = doc(db, "candidates", user.uid, "applications", currentJob.id);
      const appliedSnap = await getDoc(appliedRef);
      setHasApplied(appliedSnap.exists());
    };
    fetchData();
  }, [user, currentJob]); // Phụ thuộc vào user và job hiện tại

  // Lấy danh sách các job khác của cùng công ty (Giữ nguyên)
  useEffect(() => {
    const fetchOtherJobs = async () => {
      if (!currentJob?.companyId) return;

      const q = query(
        collection(db, "jobs"),
        where("companyId", "==", currentJob.companyId),
        where("status", "==", "published")
      );

      const querySnap = await getDocs(q);
      const jobsList = [];
      querySnap.forEach((docSnap) => {
        if (docSnap.id !== currentJob.id) {
          jobsList.push({ id: docSnap.id, ...docSnap.data() });
        }
      });

      setOtherJobs(jobsList);
    };

    fetchOtherJobs();
  }, [currentJob]);

  // Lưu / hủy lưu job (Giữ nguyên)
  const handleSaveJob = async () => {
    if (!user) {
      alert("Please log in to save this job.");
      return;
    }

    const savedRef = doc(db, "candidates", user.uid, "savedJobs", currentJob.id);

    if (isSaved) {
      await deleteDoc(savedRef);
      setIsSaved(false);
    } else {
      await setDoc(savedRef, {
        jobId: currentJob.id,
        savedAt: serverTimestamp(),
      });
      setIsSaved(true);
    }
  };

  // Khi click vào job khác trong carousel (Giữ nguyên)
  const handleSelectJob = async (oj) => {
    // Lấy thông tin company của job mới
    const companyRef = doc(db, "companies", oj.companyId);
    const companySnap = await getDoc(companyRef);
    const companyData = companySnap.exists() ? companySnap.data() : {};

    setCurrentJob(oj);
    setCurrentCompany(companyData);
    // Đóng popup nếu đang mở
    setIsApplyModalOpen(false);
  };
  
  // 🆕 Hàm mở Apply Modal
  const handleApplyClick = () => {
    if (!user) {
        alert("Please log in to apply for this job.");
        return;
    }
    if (hasApplied) {
        alert("You have already applied for this job.");
        return;
    }
    // Mở popup
    setIsApplyModalOpen(true);
  };

  // 🆕 Hàm Xử lý nộp đơn (Được gọi từ ApplyPopup)
  const handleSubmitApplication = async (coverLetter) => {
    if (!user || !currentJob || !candidateData?.cvUrl) {
        alert("Application failed: Missing user, job, or CV.");
        return;
    }
    
    try {
        const applicationData = {
            jobId: currentJob.id,
            jobTitle: currentJob.title,
            companyId: currentCompany.id,
            companyName: currentCompany.name,
            candidateId: user.uid,
            candidateName: candidateData.fullName || user.email,
            candidateEmail: user.email,
            cvUrl: candidateData.cvUrl,
            coverLetter: coverLetter,
            status: "Pending", // Trạng thái ban đầu
            appliedAt: serverTimestamp(),
        };

        // 1. Lưu đơn ứng tuyển vào collection 'applications' (công ty/admin quản lý)
        // Chúng ta nên sử dụng ID tự động cho collection chính
        const appRef = doc(collection(db, "applications")); 
        await setDoc(appRef, applicationData);
        
        // 2. Ghi lại vào profile ứng viên (để kiểm tra đã nộp hay chưa)
        const candidateAppRef = doc(db, "candidates", user.uid, "applications", currentJob.id);
        await setDoc(candidateAppRef, {
            applicationId: appRef.id,
            appliedAt: serverTimestamp(),
            status: "Pending",
        });

        setHasApplied(true);
        setIsApplyModalOpen(false);
        alert("✅ Application submitted successfully!");

    } catch (error) {
        console.error("Error submitting application:", error);
        alert("❌ Failed to submit application. Please try again.");
    }
  };


  if (!currentJob) return null;

  return (
    <div className="job-modal-overlay" onClick={onClose}>
      <div className="job-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          ×
        </button>

        {/* Modal header (Giữ nguyên) */}
        <div className="modal-header">
          <img
            src={currentCompany?.logoUrl || "/default-logo.png"}
            alt="Company Logo"
          />
          <div>
            <h2>{currentJob.title}</h2>
            <p>{currentCompany?.name}</p>
            <p>{currentJob.location}</p>
          </div>
        </div>

        {/* Modal body (Giữ nguyên) */}
        <div className="modal-body">
            {/* ... Nội dung chi tiết công việc (Giữ nguyên) ... */}
            <h3>Job Description</h3>
          <p className="job-decs">{currentJob.description || "No description available."}</p>

          <h3>Salary</h3>
          <p>
            {currentJob.salaryFrom && currentJob.salaryTo
              ? `${currentJob.salaryFrom} - ${currentJob.salaryTo} VND`
              : "Negotiable"}
          </p>

          <h3>Category</h3>
          <p>{currentJob.category}</p>

          <h3>Benefits</h3>
          <p className="job-bnf">{currentJob.benefits || "No benefits listed."}</p>
          
          {/* Carousel các job khác cùng công ty (Giữ nguyên) */}
          {otherJobs.length > 0 && (
            <>
              <h3>Other Jobs from {currentCompany?.name}</h3>
              <div className="other-jobs-carousel">
                {otherJobs.map((oj) => (
                  <div
                    key={oj.id}
                    className="carousel-card"
                    onClick={() => handleSelectJob(oj)}
                  >
                    <img
                      src={currentCompany?.logoUrl || "/default-logo.png"}
                      alt={currentCompany?.name || "Company Logo"}
                      className="carousel-logo"
                    />
                    <div className="carousel-info">
                      <h4>{oj.title}</h4>
                      <p>{oj.location}</p>
                      <p>
                        {oj.salaryFrom && oj.salaryTo
                          ? `${oj.salaryFrom} - ${oj.salaryTo} VND`
                          : "Negotiable"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Modal footer (Cập nhật nút Apply) */}
        <div className="modal-footer">
          <button 
            className={`apply-btn ${hasApplied ? "applied" : ""}`}
            onClick={handleApplyClick}
            disabled={hasApplied}
          >
            {hasApplied ? <><FiCheckCircle size={16} /> Applied</> : "Apply Now"}
          </button>
          
          <button
            className={`save-btn ${isSaved ? "saved" : ""}`}
            onClick={handleSaveJob}
            title={isSaved ? "Unsave Job" : "Save Job"}
          >
            {isSaved ? (
              <>
                <FiCheckCircle size={16} /> Saved
              </>
            ) : (
              <>
                <FiHeart size={16} /> Save
              </>
            )}
          </button>
        </div>
      </div>
      
      {/* 🆕 Apply Popup */}
      <ApplyPopup
        job={currentJob}
        company={currentCompany}
        candidate={candidateData}
        isApplying={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        onSubmit={handleSubmitApplication}
      />
    </div>
  );
}