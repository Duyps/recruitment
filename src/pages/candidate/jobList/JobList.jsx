import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import "./jobList.css";

export default function JobList({ jobs }) {
  const [companyData, setCompanyData] = useState({});
  const [expandedJobs, setExpandedJobs] = useState({}); // Lưu trạng thái mở rộng

  // Lấy thông tin công ty cho từng job
  useEffect(() => {
    const fetchCompanies = async () => {
      const companyMap = {};

      for (const job of jobs) {
        if (job.companyId && !companyMap[job.companyId]) {
          try {
            const companyRef = doc(db, "companies", job.companyId);
            const companySnap = await getDoc(companyRef);
            if (companySnap.exists()) {
              companyMap[job.companyId] = companySnap.data();
            }
          } catch (err) {
            console.error("❌ Error fetching company:", err);
          }
        }
      }

      setCompanyData(companyMap);
    };

    if (jobs.length > 0) fetchCompanies();
  }, [jobs]);

  const toggleExpand = (jobId) => {
    setExpandedJobs((prev) => ({
      ...prev,
      [jobId]: !prev[jobId],
    }));
  };

  return (
    <div className="joblist-container">
      {jobs.map((job) => {
        const company = companyData[job.companyId] || {};
        const createdAt = job.createdAt?.toDate
          ? job.createdAt.toDate().toLocaleDateString()
          : "Unknown date";

        const isExpanded = expandedJobs[job.id];

        return (
          <div className="joblist-card" key={job.id}>
            <div className="joblist-header">
              <img
                src={company.logoUrl || "/default-logo.png"}
                alt={company.name || "Company Logo"}
                className="joblist-logo"
              />
            </div>

            <div className="joblist-body">
                <h3 className="joblist-title">{job.title}</h3>
                <div className="joblist-info">
                
                    <p className="joblist-company">{company.name || "Unknown Company"}</p>
                    <p className="joblist-meta">
                    <span>{job.location || "No location"}</span> •{" "}
                    <span>{createdAt}</span>
                    </p>
                    <p className="joblist-salary">
                        {job.salaryFrom && job.salaryTo
                        ? `${job.salaryFrom} - ${job.salaryTo} VND`
                        : "Negotiable"}
                    </p>

                    <p className="joblist-category">{job.category}</p>
                </div>

              

              {job.description && (
                <div
                  className={`joblist-description ${
                    isExpanded ? "expanded" : ""
                  }`}
                >
                  {job.description}
                </div>
              )}

              {job.description && job.description.length > 100 && (
                <button
                  className="joblist-more-btn"
                  onClick={() => toggleExpand(job.id)}
                >
                  {isExpanded ? "Less" : "More"}
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
