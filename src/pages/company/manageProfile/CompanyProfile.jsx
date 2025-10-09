import React from "react";

export default function CompanyProfile({
  company,
  editing,
  formData,
  setFormData,
  setEditing,
  handleSave,
}) {
  return (
    <div>
      {/* Header */}
      <div className="company-header">
        <img
          src={company.logoUrl || "https://via.placeholder.com/100"}
          alt="Company Logo"
        />
        <div>
          <h1>{company.name || "Unnamed Company"}</h1>
          <p>{company.address || "No address available"}</p>
        </div>
      </div>

      {/* === Thông tin cơ bản === */}
      <InfoSection title="Basic Information" onEdit={() => setEditing(!editing)}>
        {editing ? (
          <div>
            <div className="info-input">
              <label>Company Name</label>
              <input
                type="text"
                value={formData.name || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="info-input">
              <label>Industry</label>
              <input
                type="text"
                value={formData.industry || ""}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
              />
            </div>
            <div className="info-input">
              <label>Company Type</label>
              <input
                type="text"
                value={formData.companyType || ""}
                onChange={(e) => setFormData({ ...formData, companyType: e.target.value })}
              />
            </div>
            <div className="info-input">
              <label>Size</label>
              <input
                type="text"
                value={formData.size || ""}
                onChange={(e) => setFormData({ ...formData, size: e.target.value })}
              />
            </div>
            <div className="info-input">
              <label>Website</label>
              <input
                type="text"
                value={formData.website || ""}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              />
            </div>
            <button onClick={handleSave} className="save-btn">
              Save Changes
            </button>
          </div>
        ) : (
          <div>
            <div className="info-row">
              <span>Industry</span>
              <span>{company.industry || "—"}</span>
            </div>
            <div className="info-row">
              <span>Company Type</span>
              <span>{company.companyType || "—"}</span>
            </div>
            <div className="info-row">
              <span>Size</span>
              <span>{company.size || "—"}</span>
            </div>
            <div className="info-row">
              <span>Website</span>
              <span>{company.website || "—"}</span>
            </div>
          </div>
        )}
      </InfoSection>

      {/* === Giới thiệu === */}
      <InfoSection title="About" onEdit={() => setEditing(!editing)}>
        {editing ? (
          <div className="info-input">
            <label>About Company</label>
            <textarea
              rows="4"
              value={formData.description || ""}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
        ) : (
          <p>{company.description || "No description provided."}</p>
        )}
      </InfoSection>
    </div>
  );
}

function InfoSection({ title, children, onEdit }) {
  return (
    <section className="info-section">
      <div className="info-section-header">
        <h2>{title}</h2>
        <button onClick={onEdit}>Edit</button>
      </div>
      {children}
    </section>
  );
}
