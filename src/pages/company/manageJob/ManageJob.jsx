import { useEffect, useState } from "react";
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
} from "react-icons/fi";
import "./managejob.css";

export default function ManageJob() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [editingJob, setEditingJob] = useState(null); // job đang được chỉnh sửa

  useEffect(() => {
    const fetchJobs = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const q = query(collection(db, "jobs"), where("companyId", "==", user.uid));
      const querySnapshot = await getDocs(q);

      const list = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setJobs(list);
      setLoading(false);
    };

    fetchJobs();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("⚠️ Bạn có chắc chắn muốn xóa job này?")) {
      await deleteDoc(doc(db, "jobs", id));
      setJobs(jobs.filter((job) => job.id !== id));
    }
  };

  const toggleStatus = async (job) => {
    const ref = doc(db, "jobs", job.id);
    await updateDoc(ref, { isActive: !job.isActive });
    setJobs(
      jobs.map((j) => (j.id === job.id ? { ...j, isActive: !j.isActive } : j))
    );
  };

  const filteredJobs =
    filter === "all"
      ? jobs
      : jobs.filter((job) => job.isActive === (filter === "active"));

  if (loading) return <p className="manage-loading">Loading jobs...</p>;

  return (
    <div className="manage-container">
      <h2 className="manage-title">Manage Posted Jobs</h2>

      <div className="manage-toolbar">
        <select
          className="manage-filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All Jobs</option>
          <option value="active">Active</option>
          <option value="inactive">Closed</option>
        </select>
      </div>

      {filteredJobs.length === 0 ? (
        <p className="manage-empty">No jobs found.</p>
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
                {job.catalog?.map((tag, index) => (
                  <span key={index} className="job-tag">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="job-info">
                <p>💰 {job.salaryRange || "Negotiable"}</p>
                <p>📍 {job.location || "—"}</p>
                <p>🧠 {job.experience || "Not specified"}</p>
              </div>

              <div className="job-actions">
                <button className="btn-edit" onClick={() => setEditingJob(job)}>
                  <FiEdit /> Edit
                </button>
                <button
                  className="btn-toggle"
                  onClick={() => toggleStatus(job)}
                  title="Toggle active/inactive"
                >
                  {job.isActive ? <FiToggleRight /> : <FiToggleLeft />}
                </button>
                <button className="btn-delete" onClick={() => handleDelete(job.id)}>
                  <FiTrash2 /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editingJob && (
        <EditJobModal
          job={editingJob}
          onClose={() => setEditingJob(null)}
          onSave={(updated) =>
            setJobs(jobs.map((j) => (j.id === updated.id ? updated : j)))
          }
        />
      )}
    </div>
  );
}

/* --------------------------------
   🧱 Component: EditJobModal
---------------------------------- */
function EditJobModal({ job, onClose, onSave }) {
  const [form, setForm] = useState({
    title: job.title || "",
    description: job.description || "",
    salaryRange: job.salaryRange || "",
    location: job.location || "",
    experience: job.experience || "",
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

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
        <h3>Edit Job</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Job title"
            required
          />
          <textarea
            name="description"
            rows="4"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
          ></textarea>
          <input
            type="text"
            name="salaryRange"
            value={form.salaryRange}
            onChange={handleChange}
            placeholder="Salary range"
          />
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Location"
          />
          <input
            type="text"
            name="experience"
            value={form.experience}
            onChange={handleChange}
            placeholder="Experience"
          />

          <div className="modal-actions">
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
