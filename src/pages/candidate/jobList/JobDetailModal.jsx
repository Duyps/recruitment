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
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { FiHeart, FiCheckCircle, FiUploadCloud } from "react-icons/fi";
import "./jobdetail.css";

// ------------------- Apply Popup -------------------
const ApplyPopup = ({ job, company, candidate, isApplying, onClose, onSubmit }) => {
  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const [useExistingCV, setUseExistingCV] = useState(true);
  const [newCvFile, setNewCvFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [cvUrl, setCvUrl] = useState(candidate?.cvUrl || null);

  const user = auth.currentUser;
  const storage = getStorage();

  if (!isApplying) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 2 * 1024 * 1024) {
      alert("⚠️ File CV quá lớn (tối đa 2MB).");
      return;
    }
    setNewCvFile(file);
  };

  const handleUploadNewCV = async () => {
    if (!newCvFile) {
      alert("Vui lòng chọn file CV trước.");
      return;
    }
    setUploading(true);
    try {
      const cvRef = ref(storage, `cvs/${user.uid}/${Date.now()}_${newCvFile.name}`);
      await uploadBytes(cvRef, newCvFile);
      const downloadURL = await getDownloadURL(cvRef);
      setCvUrl(downloadURL);
      alert("✅ Tải lên CV mới thành công!");
    } catch (err) {
      console.error("Upload error:", err);
      alert("❌ Không thể tải lên CV. Vui lòng thử lại.");
    } finally {
      setUploading(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Vui lòng đăng nhập để nộp đơn.");
      return;
    }
    if (!cvUrl) {
      alert("Bạn cần tải lên CV hoặc chọn CV có sẵn.");
      return;
    }

    setLoading(true);
    await onSubmit(coverLetter, cvUrl);
    setLoading(false);
  };

  return (
    <div className="apply-modal-overlay" onClick={onClose}>
      <form
        className="apply-modal-content"
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleFormSubmit}
      >
        <button type="button" className="close-btn" onClick={onClose}>
          ×
        </button>

        <div className="modal-header">
          <h2>Apply for {job.title}</h2>
          <p>at {company?.name}</p>
        </div>

        <div className="modal-body">
          <h3>Choose Your CV</h3>

          {/* --- Tùy chọn CV --- */}
          <div className="cv-choice">
            <label>
              <input
                type="radio"
                name="cvOption"
                checked={useExistingCV}
                onChange={() => setUseExistingCV(true)}
              />
              Use existing CV
            </label>
            <label>
              <input
                type="radio"
                name="cvOption"
                checked={!useExistingCV}
                onChange={() => setUseExistingCV(false)}
              />
              Upload new CV
            </label>
          </div>

          {/* --- Nếu chọn dùng CV cũ --- */}
          {useExistingCV && candidate?.cvUrl ? (
            <div className="cv-status-box cv-ready">
              <FiCheckCircle size={20} />
              <p>
                Current CV:{" "}
                <a href={candidate.cvUrl} target="_blank" rel="noopener noreferrer">
                  View CV
                </a>
              </p>
            </div>
          ) : useExistingCV ? (
            <div className="cv-status-box cv-missing">
              <FiUploadCloud size={20} />
              <p>No existing CV found. Please upload a new one.</p>
            </div>
          ) : null}

          {/* --- Nếu chọn tải CV mới --- */}
          {!useExistingCV && (
            <div className="cv-upload-section">
              <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
              {newCvFile && <p>File: {newCvFile.name}</p>}
              <button
                type="button"
                onClick={handleUploadNewCV}
                disabled={!newCvFile || uploading}
                className="upload-btn"
              >
                {uploading ? "Uploading..." : "Upload CV"}
              </button>
            </div>
          )}

          <label htmlFor="coverLetter">Cover Letter (Optional)</label>
          <textarea
            id="coverLetter"
            rows="5"
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            placeholder="Write a short cover letter..."
          />
        </div>

        <div className="modal-footer">
          <button type="submit" className="apply-btn" disabled={loading || uploading}>
            {loading ? "Submitting..." : "Submit Application"}
          </button>
          <button type="button" className="cancel-btn" onClick={onClose} disabled={loading}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

// ------------------- Main Job Detail -------------------
export default function JobDetailModal({ job, company, onClose }) {
  const [isSaved, setIsSaved] = useState(false);
  const [otherJobs, setOtherJobs] = useState([]);
  const [currentJob, setCurrentJob] = useState(job);
  const [currentCompany, setCurrentCompany] = useState(company);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [candidateData, setCandidateData] = useState(null);
  const [hasApplied, setHasApplied] = useState(false);
  const user = auth.currentUser;

  useEffect(() => {
    const fetchData = async () => {
      if (!user || !currentJob) return;

      const candidateRef = doc(db, "candidates", user.uid);
      const candidateSnap = await getDoc(candidateRef);
      setCandidateData(candidateSnap.exists() ? candidateSnap.data() : {});

      const savedRef = doc(db, "candidates", user.uid, "savedJobs", currentJob.id);
      setIsSaved((await getDoc(savedRef)).exists());

      const appliedRef = doc(db, "candidates", user.uid, "applications", currentJob.id);
      setHasApplied((await getDoc(appliedRef)).exists());
    };
    fetchData();
  }, [user, currentJob]);

  const handleApplyClick = () => {
    if (!user) {
      alert("Please log in to apply.");
      return;
    }
    if (hasApplied) {
      alert("You already applied for this job.");
      return;
    }
    setIsApplyModalOpen(true);
  };

  const handleSubmitApplication = async (coverLetter, cvUrl) => {
    try {
      const applicationData = {
        jobId: currentJob.id,
        jobTitle: currentJob.title,
        companyId: currentCompany.id,
        companyName: currentCompany.name,
        candidateId: user.uid,
        candidateName: candidateData.fullName || user.email,
        candidateEmail: user.email,
        cvUrl,
        coverLetter,
        status: "Pending",
        appliedAt: serverTimestamp(),
      };

      const appRef = doc(collection(db, "applications"));
      await setDoc(appRef, applicationData);

      const candidateAppRef = doc(db, "candidates", user.uid, "applications", currentJob.id);
      await setDoc(candidateAppRef, {
        applicationId: appRef.id,
        appliedAt: serverTimestamp(),
        status: "Pending",
      });

      setHasApplied(true);
      setIsApplyModalOpen(false);
      alert("✅ Application submitted successfully!");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to submit application.");
    }
  };

  const handleSaveJob = async () => {
    if (!user) return alert("Please log in to save this job.");
    const savedRef = doc(db, "candidates", user.uid, "savedJobs", currentJob.id);
    if (isSaved) {
      await deleteDoc(savedRef);
      setIsSaved(false);
    } else {
      await setDoc(savedRef, { jobId: currentJob.id, savedAt: serverTimestamp() });
      setIsSaved(true);
    }
  };

  return (
    <div className="job-modal-overlay" onClick={onClose}>
      <div className="job-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          ×
        </button>

        <div className="modal-header">
          <img src={currentCompany?.logoUrl || "/default-logo.png"} alt="logo" />
          <div>
            <h2>{currentJob.title}</h2>
            <p>{currentCompany?.name}</p>
            <p>{currentJob.location}</p>
          </div>
        </div>

        <div className="modal-body">
          <h3>Job Description</h3>
          <p>{currentJob.description || "No description available."}</p>

          <h3>Salary</h3>
          <p>
            {currentJob.salaryFrom && currentJob.salaryTo
              ? `${currentJob.salaryFrom} - ${currentJob.salaryTo} VND`
              : "Negotiable"}
          </p>

          <h3>Benefits</h3>
          <p>{currentJob.benefits || "No benefits listed."}</p>
        </div>

        <div className="modal-footer">
          <button
            className={`apply-btn ${hasApplied ? "applied" : ""}`}
            onClick={handleApplyClick}
            disabled={hasApplied}
          >
            {hasApplied ? <><FiCheckCircle /> Applied</> : "Apply Now"}
          </button>
          <button className={`save-btn ${isSaved ? "saved" : ""}`} onClick={handleSaveJob}>
            {isSaved ? <><FiCheckCircle /> Saved</> : <><FiHeart /> Save</>}
          </button>
        </div>
      </div>

      {/* Popup Apply */}
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
