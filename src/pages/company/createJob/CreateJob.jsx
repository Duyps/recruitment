import { useState } from "react";
import './create.css';

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
    status: "Draft",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("📤 Job data:", formData);
    alert("✅ Job post created (sample). You can now connect to Firestore.");
  };

  return (
    <div className="company-dashboard">
      {/* === Sidebar === */}
      <aside className="sidebar">
        <h2>Dashboard</h2>
        <ul>
          <li className="active">📝 Create New</li>
          <li>📋 Jobs</li>
          <li>🏢 Profile</li>
        </ul>
      </aside>

      {/* === Main Content === */}
      <main className="main-content">
        <h2>Create New Job</h2>
        <form className="job-form" onSubmit={handleSubmit}>
          {/* --- Basic Info --- */}
          <section className="form-section">
            <h3>Basic Information</h3>
            <div className="form-group">
              <label>Job Title</label>
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
                  <option>Full-time</option>
                  <option>Part-time</option>
                  <option>Internship</option>
                  <option>Freelance</option>
                  <option>Remote</option>
                </select>
              </div>

              <div className="form-group">
                <label>Work Mode</label>
                <select name="workMode" value={formData.workMode} onChange={handleChange}>
                  <option>On-site</option>
                  <option>Remote</option>
                  <option>Hybrid</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., Ho Chi Minh City"
              />
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
              <label>Category</label>
              <select name="category" value={formData.category} onChange={handleChange}>
                <option value="">Select category</option>
                <option>Frontend</option>
                <option>Backend</option>
                <option>Mobile</option>
                <option>AI / Data</option>
                <option>DevOps</option>
                <option>UI / UX</option>
                <option>QA / Tester</option>
                <option>Product Manager</option>
                <option>Marketing</option>
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
                  <option>Not required</option>
                  <option>Bachelor</option>
                  <option>Master</option>
                  <option>PhD</option>
                </select>
              </div>
            </div>
          </section>

          {/* --- Description --- */}
          <section className="form-section">
            <h3>Job Details</h3>
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
            <button type="submit" className="btn-primary">
              Publish Job
            </button>
            <button type="button" className="btn-secondary">
              Save as Draft
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
