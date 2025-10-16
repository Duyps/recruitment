import { useEffect, useState, useCallback } from "react";
import { auth, db } from "../../../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import {
  FiEdit,
  FiTrash2,
  FiToggleLeft,
  FiToggleRight,
  FiUsers,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import "./managejob.css";

/* ===========================================================
   🔹 HÀM HỖ TRỢ: Đếm số lượng ứng viên cho danh sách job
   =========================================================== */
const fetchApplicationsCount = async (jobIds, companyId) => {
  if (jobIds.length === 0) return {};

  const batchSize = 10; // Firestore giới hạn 10 phần tử trong mệnh đề "in"
  const applicationCounts = {};

  for (let i = 0; i < jobIds.length; i += batchSize) {
    const batchJobIds = jobIds.slice(i, i + batchSize);

    const q = query(
      collection(db, "applications"),
      where("companyId", "==", companyId),
      where("jobId", "in", batchJobIds)
    );

    const querySnapshot = await getDocs(q);
    querySnapshot.docs.forEach((docSnap) => {
      const jobId = docSnap.data().jobId;
      applicationCounts[jobId] = (applicationCounts[jobId] || 0) + 1;
    });
  }

  return applicationCounts;
};

/* ===========================================================
   🔹 COMPONENT CHÍNH: ManageJob
   =========================================================== */
export default function ManageJob() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [editingJob, setEditingJob] = useState(null);
  const navigate = useNavigate();

  /* --- Lấy danh sách Job --- */
  const fetchJobs = useCallback(async () => {
    const user = auth.currentUser;
    if (!user) {
      setLoading(false);
      return;
    }

    const companyId = user.uid;

    try {
      // 1️⃣ Lấy danh sách job theo công ty
      const jobsQuery = query(collection(db, "jobs"), where("companyId", "==", companyId));
      const jobsSnapshot = await getDocs(jobsQuery);

      let jobList = jobsSnapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
        applicationsCount: 0,
      }));

      // 2️⃣ Lấy số lượng ứng viên cho từng job
      const jobIds = jobList.map((j) => j.id);
      const applicationCounts = await fetchApplicationsCount(jobIds, companyId);

      // 3️⃣ Gắn số lượng ứng viên vào từng job
      jobList = jobList.map((job) => ({
        ...job,
        applicationsCount: applicationCounts[job.id] || 0,
      }));

      setJobs(jobList);
    } catch (error) {
      console.error("Error fetching jobs or applications:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  /* --- Xử lý xóa job --- */
  const handleDelete = async (e, id) => {
    e.stopPropagation();
    const confirm = window.confirm("⚠️ Bạn có chắc chắn muốn xóa job này? Hành động này không thể hoàn tác.");

    if (!confirm) return;
    try {
      await deleteDoc(doc(db, "jobs", id));
      setJobs((prev) => prev.filter((j) => j.id !== id));
    } catch (error) {
      alert("Lỗi khi xóa job: " + error.message);
    }
  };

  /* --- Toggle trạng thái job --- */
  const toggleStatus = async (e, job) => {
    e.stopPropagation();
    try {
      const ref = doc(db, "jobs", job.id);
      await updateDoc(ref, { isActive: !job.isActive });

      setJobs((prev) =>
        prev.map((j) => (j.id === job.id ? { ...j, isActive: !j.isActive } : j))
      );
    } catch (error) {
      alert("Lỗi khi cập nhật trạng thái: " + error.message);
    }
  };

  /* --- Xem danh sách ứng viên --- */
  const handleViewCandidates = (jobId) => {
    navigate(`/company/home/jobs/${jobId}`);
  };

  /* --- Sửa job --- */
  const handleEditClick = (e, job) => {
    e.stopPropagation();
    setEditingJob(job);
  };

  /* --- Lọc job theo trạng thái --- */
  const filteredJobs =
    filter === "all" ? jobs : jobs.filter((j) => j.isActive === (filter === "active"));

  if (loading) return <p className="manage-loading">Đang tải danh sách công việc...</p>;

  /* ===========================================================
     🔹 Giao diện render
     =========================================================== */
  return (
    <div className="manage-container">
      <h2 className="manage-title">
        Quản lý Tin Tuyển Dụng Đã Đăng ({jobs.length})
      </h2>

      {/* Toolbar */}
      <div className="manage-toolbar">
        <select
          className="manage-filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">Tất cả</option>
          <option value="active">Đang hoạt động</option>
          <option value="inactive">Đã đóng</option>
        </select>

        <button className="btn-new-job" onClick={() => navigate("/company/home/create")}>
          + Đăng Tin Mới
        </button>
      </div>

      {/* Danh sách job */}
      {filteredJobs.length === 0 ? (
        <p className="manage-empty">Không tìm thấy công việc nào.</p>
      ) : (
        <div className="manage-grid">
          {filteredJobs.map((job) => (
            <div key={job.id} className="job-card">
              <div className="job-header">
                <h3 className="job-title">{job.title}</h3>
                <span className={`job-status ${job.isActive ? "active" : "inactive"}`}>
                  {job.isActive ? "Active" : "Closed"}
                </span>
              </div>

              <p className="job-desc">
                {job.description?.length > 120
                  ? job.description.slice(0, 120) + "..."
                  : job.description || "No description"}
              </p>

              <div className="job-tags">
                {job.catalog?.slice(0, 3).map((tag, i) => (
                  <span key={i} className="job-tag">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="job-info">
                <p>💰 <strong>Mức lương:</strong> {job.salaryRange || "Thương lượng"}</p>
                <p>📍 <strong>Địa điểm:</strong> {job.location || "—"}</p>
                <p>🧠 <strong>Kinh nghiệm:</strong> {job.experience || "Chưa xác định"}</p>
              </div>

              <div className="job-actions">
                {/* Xem ứng viên */}
                <button
                  className="btn-view-candidates"
                  onClick={() => handleViewCandidates(job.id)}
                  title="Xem danh sách ứng viên đã nộp đơn"
                >
                  <FiUsers size={18} /> Xem Ứng Viên ({job.applicationsCount})
                </button>

                {/* Hành động phụ */}
                <div className="job-secondary-actions">
                  <button
                    className="btn-edit"
                    onClick={(e) => handleEditClick(e, job)}
                    title="Chỉnh sửa chi tiết"
                  >
                    <FiEdit />
                  </button>

                  <button
                    className="btn-toggle"
                    onClick={(e) => toggleStatus(e, job)}
                    title={job.isActive ? "Đóng Job" : "Mở lại Job"}
                  >
                    {job.isActive ? <FiToggleRight /> : <FiToggleLeft />}
                  </button>

                  <button
                    className="btn-delete"
                    onClick={(e) => handleDelete(e, job.id)}
                    title="Xóa Job"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal chỉnh sửa */}
      {editingJob && (
        <EditJobModal
          job={editingJob}
          onClose={() => setEditingJob(null)}
          onSave={(updated) =>
            setJobs((prev) => prev.map((j) => (j.id === updated.id ? updated : j)))
          }
        />
      )}
    </div>
  );
}

/* ===========================================================
   🔹 COMPONENT PHỤ: EditJobModal
   =========================================================== */
function EditJobModal({ job, onClose, onSave }) {
  const [form, setForm] = useState({
    title: job.title || "",
    description: job.description || "",
    salaryRange: job.salaryRange || "",
    location: job.location || "",
    experience: job.experience || "",
  });

  const [saving, setSaving] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const ref = doc(db, "jobs", job.id);
      await updateDoc(ref, form);
      onSave({ ...job, ...form });
      onClose();
    } catch (err) {
      alert("❌ Lỗi khi cập nhật job: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h3>Chỉnh Sửa Công Việc</h3>
        <button className="modal-close-btn" onClick={onClose}>
          &times;
        </button>

        <form onSubmit={handleSubmit}>
          <label>Tiêu đề</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Tiêu đề công việc"
            required
          />

          <label>Mô tả</label>
          <textarea
            name="description"
            rows="4"
            value={form.description}
            onChange={handleChange}
            placeholder="Mô tả chi tiết"
          />

          <label>Mức lương</label>
          <input
            type="text"
            name="salaryRange"
            value={form.salaryRange}
            onChange={handleChange}
            placeholder="Mức lương"
          />

          <label>Địa điểm</label>
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Địa điểm làm việc"
          />

          <label>Kinh nghiệm</label>
          <input
            type="text"
            name="experience"
            value={form.experience}
            onChange={handleChange}
            placeholder="Yêu cầu kinh nghiệm"
          />

          <div className="modal-actions">
            <button type="button" onClick={onClose} disabled={saving}>
              Hủy
            </button>
            <button type="submit" disabled={saving}>
              {saving ? "Đang lưu..." : "Lưu Thay Đổi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
