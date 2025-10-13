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
import { FiHeart, FiCheckCircle } from "react-icons/fi"; 
import "./jobdetail.css";

export default function JobDetailModal({ job, company, onClose }) {
  const [isSaved, setIsSaved] = useState(false);
  const [otherJobs, setOtherJobs] = useState([]);
  const [currentJob, setCurrentJob] = useState(job);
  const [currentCompany, setCurrentCompany] = useState(company);

  const user = auth.currentUser;

  // Khi props job hoặc company thay đổi
  useEffect(() => {
    setCurrentJob(job);
    setCurrentCompany(company);
  }, [job, company]);

  // Kiểm tra job đã lưu
  useEffect(() => {
    const checkIfSaved = async () => {
      if (!user || !currentJob) return;
      const savedRef = doc(db, "candidates", user.uid, "savedJobs", currentJob.id);
      const savedSnap = await getDoc(savedRef);
      setIsSaved(savedSnap.exists());
    };
    checkIfSaved();
  }, [user, currentJob]);

  // Lấy danh sách các job khác của cùng công ty
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

  // Lưu / hủy lưu job
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

  // Khi click vào job khác trong carousel
  const handleSelectJob = async (oj) => {
    // Lấy thông tin company của job mới
    const companyRef = doc(db, "companies", oj.companyId);
    const companySnap = await getDoc(companyRef);
    const companyData = companySnap.exists() ? companySnap.data() : {};

    setCurrentJob(oj);
    setCurrentCompany(companyData);
  };

  if (!currentJob) return null;

  return (
    <div className="job-modal-overlay" onClick={onClose}>
      <div className="job-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          ×
        </button>

        {/* Modal header */}
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

        {/* Modal body */}
        <div className="modal-body">
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

          {/* Carousel các job khác cùng công ty */}
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

        {/* Modal footer */}
        <div className="modal-footer">
          <button className="apply-btn">
            Apply Now
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
    </div>
  );
}
