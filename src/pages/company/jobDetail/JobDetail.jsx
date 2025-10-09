import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db, auth } from "../../../firebase";
import {
  doc,
  getDoc,
  deleteDoc,
  collection,
  getDocs,
  query,
  where,
  updateDoc,
} from "firebase/firestore";
import { FiTrash2, FiEdit, FiToggleLeft, FiToggleRight, FiArrowLeft } from "react-icons/fi";
import "./jobdetail.css";

export default function JobDetail() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      // Lấy thông tin job
      const jobRef = doc(db, "jobs", jobId);
      const jobSnap = await getDoc(jobRef);

      if (jobSnap.exists()) {
        const data = jobSnap.data();
        if (data.companyId !== user.uid) {
          alert("❌ You do not have permission to view this job.");
          navigate("/company/managejob");
          return;
        }
        setJob({ id: jobSnap.id, ...data });
      } else {
        alert("Job not found.");
        navigate("/company/managejob");
      }

      // Lấy danh sách ứng viên apply job này
      const appsRef = collection(db, "applications");
      const q = query(appsRef, where("jobId", "==", jobId));
      const querySnapshot = await getDocs(q);
      const list = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setApplicants(list);

      setLoading(false);
    };

    fetchData();
  }, [jobId]);

  const handleDelete = async () => {
    if (window.confirm("⚠️ Delete this job permanently?")) {
      await deleteDoc(doc(db, "jobs", job.id));
      alert("🗑️ Job deleted successfully!");
      navigate("/company/managejob");
    }
  };

  const toggleActive = async () => {
    const ref = doc(db, "jobs", job.id);
    await updateDoc(ref, { isActive: !job.isActive });
    setJob({ ...job, isActive: !job.isActive });
  };

  const updateApplicantStatus = async (id, status) => {
    const ref = doc(db, "applications", id);
    await updateDoc(ref, { status });
    setApplicants(
      applicants.map((a) => (a.id === id ? { ...a, status } : a))
    );
  };

  if (loading) return <p className="jobdetail-loading">Loading...</p>;
  if (!job) return null;

  return (
    <div className="jobdetail-container">
      <button className="back-btn" onClick={() => navigate("/company/managejob")}>
        <FiArrowLeft /> Back
      </button>

      <div className="jobdetail-header">
        <h2>{job.title}</h2>
        <div className="header-actions">
          <button onClick={() => navigate(`/company/editjob/${job.id}`)} className="btn-edit">
            <FiEdit /> Edit
          </button>
          <button onClick={toggleActive} className="btn-toggle">
            {job.isActive ? <FiToggleRight /> : <FiToggleLeft />}
            {job.isActive ? "Active" : "Closed"}
          </button>
          <button onClick={handleDelete} className="btn-delete">
            <FiTrash2 /> Delete
          </button>
        </div>
      </div>

      <div className="jobdetail-grid">
        {/* --- LEFT: Job Info --- */}
        <div className="jobdetail-info">
          <h3>Job Information</h3>
          <p><strong>Type:</strong> {job.type}</p>
          <p><strong>Work Mode:</strong> {job.workMode}</p>
          <p><strong>Location:</strong> {job.location}</p>
          <p><strong>Salary:</strong> {job.salaryFrom} - {job.salaryTo} VND</p>
          <p><strong>Experience:</strong> {job.experience || "Not specified"}</p>
          <p><strong>Education:</strong> {job.education}</p>
          <p><strong>Deadline:</strong> {job.deadline || "—"}</p>
          <p><strong>Vacancies:</strong> {job.vacancies || "—"}</p>
          <p><strong>Skills:</strong> {job.skills}</p>
          <p><strong>Description:</strong> {job.description}</p>
          <p><strong>Responsibilities:</strong> {job.responsibilities}</p>
          <p><strong>Benefits:</strong> {job.benefits}</p>
        </div>

        {/* --- RIGHT: Applicants --- */}
        <div className="jobdetail-applicants">
          <h3>Applicants ({applicants.length})</h3>
          {applicants.length === 0 ? (
            <p>No one has applied yet.</p>
          ) : (
            <table className="applicants-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>CV</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {applicants.map((a) => (
                  <tr key={a.id}>
                    <td>{a.candidateName}</td>
                    <td>{a.email}</td>
                    <td>
                      {a.resumeUrl ? (
                        <a
                          href={a.resumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          📎 View
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td>{a.status || "Pending"}</td>
                    <td className="status-actions">
                      <button
                        onClick={() => updateApplicantStatus(a.id, "Accepted")}
                        className="btn-accept"
                      >
                        ✅ Accept
                      </button>
                      <button
                        onClick={() => updateApplicantStatus(a.id, "Rejected")}
                        className="btn-reject"
                      >
                        ❌ Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
