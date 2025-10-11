import { useState } from "react";
import { auth, db } from "../../../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { catalogList } from "../../../data/catalogList";
import { locationList, workModeList, jobTypeList, educationList } from "../../../data/jobData";
import "./create.css";

export default function CreateJob() {
  const [formData, setFormData] = useState({
    title: "",
    type: "Full-time",
    workMode: "On-site",
    location: "",
    salaryFrom: "",
    salaryTo: "",
    category: "",
    skills: "",
    experience: "",
    education: "",
    description: "",
    responsibilities: "",
    benefits: "",
    vacancies: "",
    deadline: "",
    contactEmail: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (status) => {
    const user = auth.currentUser;
    if (!user) {
      alert("❌ Please log in first.");
      return;
    }

    // Kiểm tra dữ liệu bắt buộc
    if (!formData.title || !formData.category || !formData.description) {
      alert("⚠️ Please fill in all required fields: title, category, description.");
      return;
    }

    try {
      setLoading(true);
      const jobData = {
        ...formData,
        companyId: user.uid,
        isActive: status === "published", 
        status: status, // 'draft' or 'published'
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await addDoc(collection(db, "jobs"), jobData);
      alert(status === "published" ? "✅ Job published successfully!" : "💾 Saved as draft!");
      setFormData({
        title: "",
        type: "Full-time",
        workMode: "On-site",
        location: "",
        salaryFrom: "",
        salaryTo: "",
        category: "",
        skills: "",
        experience: "",
        education: "",
        description: "",
        responsibilities: "",
        benefits: "",
        vacancies: "",
        deadline: "",
        contactEmail: "",
        isActive: true, 
      });
    } catch (error) {
      console.error("❌ Error creating job:", error);
      alert("Error creating job post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="company-dashboard">

      {/* === Main Content === */}
      <main className="main-content">
        <h2>Create New Job</h2>
        <form className="job-form" onSubmit={(e) => e.preventDefault()}>
          {/* --- Basic Info --- */}
          <section className="form-section">
            <h3>Basic Information</h3>
            <div className="form-group">
              <label>Job Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Job Type</label>
                <select name="type" value={formData.type} onChange={handleChange}>
                  {jobTypeList.map((type, i) => (
                    <option key={i} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Work Mode</label>
                <select name="workMode" value={formData.workMode} onChange={handleChange}>
                  {workModeList.map((mode, i) => (
                    <option key={i} value={mode}>
                      {mode}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Location</label>
              <select
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
              >
                <option value="">Select location</option>
                {locationList.map((loc, i) => (
                  <option key={i} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Salary From (VND)</label>
                <input
                  type="number"
                  name="salaryFrom"
                  value={formData.salaryFrom}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Salary To (VND)</label>
                <input
                  type="number"
                  name="salaryTo"
                  value={formData.salaryTo}
                  onChange={handleChange}
                />
              </div>
            </div>
          </section>

          {/* --- Category --- */}
          <section className="form-section">
            <h3>Category & Skills</h3>
            <div className="form-group">
              <label>Category *</label>
              <select name="category" value={formData.category} onChange={handleChange}>
                <option value="">Select category</option>
                {catalogList.map((c, i) => (
                  <option key={i} value={c}>
                    {c}
                  </option>
                ))}
              </select>

            </div>
            <div className="form-group">
              <label>Skills (comma separated)</label>
              <input
                type="text"
                name="skills"
                placeholder="React, NodeJS, AWS..."
                value={formData.skills}
                onChange={handleChange}
              />
            </div>
          </section>

          {/* --- Requirements --- */}
          <section className="form-section">
            <h3>Requirements</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Experience (years)</label>
                <input
                  type="number"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  placeholder="e.g. 2"
                />
              </div>
              <div className="form-group">
                <label>Education Level</label>
                <select
                  name="education"
                  value={formData.education}
                  onChange={handleChange}
                >
                  {educationList.map((ed, i) => (
                    <option key={i} value={ed}>
                      {ed}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* --- Description --- */}
          <section className="form-section">
            <h3>Job Details *</h3>
            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                rows="3"
                value={formData.description}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Responsibilities</label>
              <textarea
                name="responsibilities"
                rows="3"
                value={formData.responsibilities}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Benefits</label>
              <textarea
                name="benefits"
                rows="3"
                value={formData.benefits}
                onChange={handleChange}
              />
            </div>
          </section>

          {/* --- Additional Info --- */}
          <section className="form-section">
            <h3>Additional Info</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Vacancies</label>
                <input
                  type="number"
                  name="vacancies"
                  value={formData.vacancies}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Deadline</label>
                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Contact Email</label>
              <input
                type="email"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleChange}
              />
            </div>
          </section>

          <div className="button-group">
            <button
              type="button"
              className="btn-primary"
              onClick={() => handleSubmit("published")}
              disabled={loading}
            >
              {loading ? "Publishing..." : "Publish Job"}
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => handleSubmit("draft")}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save as Draft"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
