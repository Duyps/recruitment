import React, { useEffect, useState } from "react";
import { auth, db } from "../../../firebase";
import {
  doc,
  setDoc,
  deleteDoc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import "./jobdetail.css";

export default function JobDetailModal({ job, company, onClose }) {
  const [isSaved, setIsSaved] = useState(false);
  const user = auth.currentUser;

  useEffect(() => {
    const checkIfSaved = async () => {
      if (!user || !job) return;
      const savedRef = doc(db, "candidates", user.uid, "savedJobs", job.id);
      const savedSnap = await getDoc(savedRef);
      setIsSaved(savedSnap.exists());
    };
    checkIfSaved();
  }, [user, job]);

  const handleSaveJob = async () => {
    if (!user) {
      alert("Please log in to save this job.");
      return;
    }

    const savedRef = doc(db, "candidates", user.uid, "savedJobs", job.id);

    if (isSaved) {
      await deleteDoc(savedRef);
      setIsSaved(false);
    } else {
      await setDoc(savedRef, {
        jobId: job.id,
        savedAt: serverTimestamp(),
      });
      setIsSaved(true);
    }
  };

  if (!job) return null;

  return (
    <div className="job-modal-overlay" onClick={onClose}>
      <div className="job-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          ×
        </button>

        <div className="modal-header">
          <img
            src={company?.logoUrl || "/default-logo.png"}
            alt="Company Logo"
          />
          <div>
            <h2>{job.title}</h2>
            <p>{company?.name}</p>
            <p>{job.location}</p>
          </div>
        </div>

        <div className="modal-body">
          <h3>Job Description</h3>
          <p>{job.description || "No description available."}</p>

          <h3>Salary</h3>
          <p>
            {job.salaryFrom && job.salaryTo
              ? `${job.salaryFrom} - ${job.salaryTo} VND`
              : "Negotiable"}
          </p>

          <h3>Category</h3>
          <p>{job.category}</p>

          <h3>Benefits</h3>
          <p>{job.benefits}</p>
        </div>

        <div className="modal-footer">
          <button className="apply-btn">Apply Now</button>
          <button
            className={`save-btn ${isSaved ? "saved" : ""}`}
            onClick={handleSaveJob}
          >
            {isSaved ? "Saved ✓" : "Save Job"}
          </button>
        </div>
      </div>
    </div>
  );
}
