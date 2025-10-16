// src/pages/company/public/CompanyPublicInfo.jsx
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../../firebase";
import JobDetailModal from "../jobList/JobDetailModal";
import "./companyInfo.css";

export default function CompanyPublicInfo() {
  const { companyId } = useParams();
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);

  // Lấy thông tin công ty
  useEffect(() => {
    const fetchCompany = async () => {
      const ref = doc(db, "companies", companyId);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setCompany({ id: snap.id, ...snap.data() });
      }
    };
    fetchCompany();
  }, [companyId]);

  // Lấy danh sách job
  useEffect(() => {
    const fetchJobs = async () => {
      const q = query(
        collection(db, "jobs"),
        where("companyId", "==", companyId),
        where("status", "==", "published")
      );
      const snap = await getDocs(q);
      const jobList = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setJobs(jobList);
    };
    fetchJobs();
  }, [companyId]);

  if (!company)
    return <div className="company-loading">Loading company profile...</div>;

  return (
    <div className="company-public-container">
      
      {/* 1. HEADER - Thông tin tổng quan */}
      <div className="company-header-hero">
        {/* Banner sẽ được đặt ở đây qua CSS, nếu không có ảnh bìa */}
        
        <div className="company-profile-card">
          <img
            src={company.logoUrl || "/default-logo.png"}
            alt="Company Logo"
            className="company-avatar"
          />
          <div className="company-info-block">
            <h1 className="company-name">{company.name}</h1>
            <p className="company-industry">{company.industry || "No industry info"}</p>
            <div className="company-quick-meta">
              <p>📍 {company.location || "Location not provided"}</p>
              {company.size && <p>👥 {company.size}</p>}
              {company.founded && <p>📅 {company.founded}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* 2. BODY - Bố cục 2 Cột: Chi tiết (Trái) và Jobs (Phải) */}
      <div className="company-body-content">
        
        {/* CỘT TRÁI - CHI TIẾT CÔNG TY */}
        <div className="company-sidebar">
          
          {/* A. Thông tin liên hệ (Key Details) */}
          <section className="company-key-details">
            <h2>Key Information</h2>
            <div className="details-grid">
              {company.location && (
                <p><strong>Location:</strong> {company.location}</p>
              )}
              {company.size && (
                <p><strong>Size:</strong> {company.size}</p>
              )}
              {company.industry && (
                <p><strong>Industry:</strong> {company.industry}</p>
              )}
              {company.founded && (
                <p><strong>Founded:</strong> {company.founded}</p>
              )}
              {company.website && (
                <p>
                  <strong>Website:</strong> 
                  <a href={company.website} target="_blank" rel="noreferrer">
                    {company.website}
                  </a>
                </p>
              )}
              {company.email && (
                <p><strong>Email:</strong> {company.email}</p>
              )}
              {company.type && (
                <p><strong>Type:</strong> {company.type}</p>
              )}
              {/* Thêm các thông tin khác (Social media, Phone...) tại đây */}
            </div>
          </section>

          {/* B. Giới thiệu công ty (About) */}
          <section className="company-about">
            <h2>About {company.name}</h2>
            <p>{company.description || "This company has not added a description yet."}</p>
          </section>

        </div>

        {/* CỘT PHẢI - DANH SÁCH JOB */}
        <section className="company-jobs-section">
          <h2>Open Positions ({jobs.length})</h2>
          {jobs.length === 0 ? (
            <p className="no-jobs-text">This company has no active job postings.</p>
          ) : (
            <div className="company-jobs-list">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="company-job-card"
                  onClick={() => setSelectedJob(job)}
                >
                  <h3>{job.title}</h3>
                  <p className="job-meta">
                    <span className="job-location">📍 {job.location || "Remote"}</span>
                    <span className="job-salary">
                      💰 {job.salaryFrom && job.salaryTo
                        ? `${job.salaryFrom} - ${job.salaryTo} VND`
                        : "Negotiable"}
                    </span>
                  </p>
                  <span className="job-category">{job.category}</span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Popup chi tiết job */}
      {selectedJob && (
        <JobDetailModal
          job={selectedJob}
          company={company}
          onClose={() => setSelectedJob(null)}
        />
      )}
    </div>
  );
}