import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { auth, db } from "../../../firebase";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import "./jobdetail.css";

export default function JobDetail() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  /* ============================================================
     🔹 Lấy thông tin công việc
  ============================================================ */
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const jobRef = doc(db, "jobs", jobId);
        const jobSnap = await getDoc(jobRef);

        if (jobSnap.exists()) {
          setJob({ id: jobSnap.id, ...jobSnap.data() });
        } else {
          alert("Không tìm thấy công việc này.");
          navigate("/company/home/jobs");
        }
      } catch (err) {
        console.error("Error fetching job:", err);
      }
    };

    fetchJob();
  }, [jobId, navigate]);

  /* ============================================================
     🔹 Lấy danh sách ứng viên ứng tuyển job này
  ============================================================ */
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const companyId = user.uid;
        const q = query(
          collection(db, "applications"),
          where("companyId", "==", companyId),
          where("jobId", "==", jobId)
        );

        const snapshot = await getDocs(q);
        const apps = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setCandidates(apps);
      } catch (err) {
        console.error("Error fetching candidates:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, [jobId]);

  /* ============================================================
     🔹 Cập nhật trạng thái ứng viên
  ============================================================ */
  const handleStatusChange = async (appId, newStatus) => {
    try {
      const ref = doc(db, "applications", appId);
      await updateDoc(ref, { status: newStatus });

      setCandidates((prev) =>
        prev.map((app) =>
          app.id === appId ? { ...app, status: newStatus } : app
        )
      );
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  if (loading) return <p className="jobdetail-loading">Đang tải dữ liệu...</p>;
  if (!job) return <p className="jobdetail-notfound">Không tìm thấy công việc.</p>;

  /* ============================================================
     🔹 Giao diện chính
  ============================================================ */
  return (
    <div className="jobdetail-container">
      <button className="btn-back" onClick={() => navigate(-1)}>
        ← Quay lại
      </button>

      {/* ===== THÔNG TIN CÔNG VIỆC ===== */}
      <section className="jobdetail-section">
        <h2>{job.title}</h2>
        <p><strong>Mức lương:</strong> {job.salaryRange || "Thương lượng"}</p>
        <p><strong>Địa điểm:</strong> {job.location || "—"}</p>
        <p><strong>Kinh nghiệm:</strong> {job.experience || "Không yêu cầu"}</p>
        <p><strong>Mô tả:</strong> {job.description}</p>
      </section>

      {/* ===== DANH SÁCH ỨNG VIÊN ===== */}
      <section className="jobdetail-section">
        <h3>Danh sách ứng viên ({candidates.length})</h3>

        {candidates.length === 0 ? (
          <p className="no-candidates">Chưa có ai ứng tuyển công việc này.</p>
        ) : (
          <table className="candidate-table">
            <thead>
              <tr>
                <th>Tên</th>
                <th>Email</th>
                <th>Ngày nộp</th>
                <th>Trạng thái</th>
                <th>CV</th>
                <th>Chi tiết</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((c) => (
                <tr key={c.id}>
                  <td>{c.candidateName}</td>
                  <td>{c.candidateEmail}</td>
                  <td>
                    {c.appliedAt && c.appliedAt.toDate
                      ? c.appliedAt.toDate().toLocaleString("vi-VN")
                      : "—"}
                  </td>
                  <td>
                    <span className={`status-badge ${c.status.toLowerCase()}`}>
                      {c.status}
                    </span>
                  </td>
                  <td>
                    {c.cvUrl ? (
                      <a
                        href={c.cvUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cv-link"
                      >
                        Xem CV
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td>
                    <button
                      className="btn-view"
                      onClick={() => setSelectedCandidate(c)}
                    >
                      Xem
                    </button>
                  </td>
                  <td>
                    <select
                      value={c.status}
                      onChange={(e) =>
                        handleStatusChange(c.id, e.target.value)
                      }
                    >
                      <option value="Pending">Pending</option>
                      <option value="Reviewed">Reviewed</option>
                      <option value="Accepted">Accepted</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* ===== MODAL XEM ỨNG VIÊN ===== */}
      {selectedCandidate && (
        <CandidateModal
          candidate={selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
        />
      )}
    </div>
  );
}

/* ============================================================
   🔹 COMPONENT PHỤ: Modal Xem Chi Tiết Ứng Viên
============================================================ */
function CandidateModal({ candidate, onClose }) {
  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <button className="modal-close-btn" onClick={onClose}>
          &times;
        </button>
        <h3>Chi tiết ứng viên</h3>
        <p><strong>Họ tên:</strong> {candidate.candidateName}</p>
        <p><strong>Email:</strong> {candidate.candidateEmail}</p>
        <p><strong>Ngày ứng tuyển:</strong>{" "}
          {candidate.appliedAt && candidate.appliedAt.toDate
            ? candidate.appliedAt.toDate().toLocaleString("vi-VN")
            : "—"}
        </p>
        <p><strong>Trạng thái:</strong> {candidate.status}</p>
        <p><strong>Thư giới thiệu:</strong> {candidate.coverLetter || "—"}</p>
        <p>
          <strong>CV:</strong>{" "}
          {candidate.cvUrl ? (
            <a
              href={candidate.cvUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="cv-link"
            >
              Mở CV
            </a>
          ) : (
            "Không có"
          )}
        </p>
      </div>
    </div>
  );
}
