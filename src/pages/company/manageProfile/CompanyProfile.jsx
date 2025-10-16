import React, { useState, useEffect } from "react";
import { auth, db } from "../../../firebase";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { FiEdit2, FiCheck, FiX } from "react-icons/fi";
import "./companyProfile.css";

export default function CompanyProfile() {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [logoFile, setLogoFile] = useState(null);

  const user = auth.currentUser;

  // === Fetch company data ===
  useEffect(() => {
    const fetchCompany = async () => {
      if (!user) return;
      try {
        const ref = doc(db, "companies", user.uid);
        const snap = await getDoc(ref);
        const data = snap.exists()
          ? snap.data()
          : {
              name: "",
              industry: "",
              companyType: "",
              size: "",
              website: "",
              description: "",
              logoUrl: "",
            };
        setCompany(data);
      } catch (err) {
        console.error("Error fetching company:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCompany();
  }, [user]);

  // === Upload to Cloudinary ===
  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "cruitment");
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/dxgaqawwy/image/upload`,
      { method: "POST", body: formData }
    );
    const data = await res.json();
    if (!data.secure_url) throw new Error("Upload failed");
    return data.secure_url;
  };

  // === Save company info ===
  const handleSave = async () => {
    if (!user || !company) return;
    setSaving(true);
    try {
      const ref = doc(db, "companies", user.uid);
      let updateData = { ...company };

      if (logoFile) {
        const uploadedUrl = await uploadToCloudinary(logoFile);
        updateData.logoUrl = uploadedUrl;
        setLogoFile(null);
      }

      await updateDoc(ref, { ...updateData, updatedAt: serverTimestamp() });
      setCompany(updateData);
      setEditing(false);
      alert("✅ Company info updated!");
    } catch (err) {
      console.error("Update failed:", err);
      alert("❌ Failed to update info");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!company) return <p>No company data found.</p>;

  return (
    <div className="company-profile">
      {/* === HEADER === */}
      <div className="company-header">
        <div className="logo-wrapper">
          <img
            src={
              logoFile
                ? URL.createObjectURL(logoFile)
                : company.logoUrl || "https://via.placeholder.com/120"
            }
            alt="Company Logo"
            className="company-logo"
          />
          {editing && (
            <label className="edit-logo-btn">
              <FiEdit2 size={14} />
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => setLogoFile(e.target.files[0])}
              />
            </label>
          )}
        </div>

        <div className="company-info">
          <h1>{company.name || "Unnamed Company"}</h1>
          <p>{company.address || "No address provided"}</p>
        </div>

        {!editing && (
          <button className="edit-btn" onClick={() => setEditing(true)}>
            <FiEdit2 /> Edit
          </button>
        )}
      </div>

      {/* === BASIC INFORMATION === */}
      <section className="info-section">
        <h2>Basic Information</h2>
        {editing ? (
          <div className="edit-form">
            <div className="form-row">
              <label>Company Name</label>
              <input
                type="text"
                value={company.name || ""}
                onChange={(e) => setCompany({ ...company, name: e.target.value })}
              />
            </div>

            <div className="form-row">
              <label>Industry</label>
              <input
                type="text"
                value={company.industry || ""}
                onChange={(e) =>
                  setCompany({ ...company, industry: e.target.value })
                }
              />
            </div>

            <div className="form-row">
              <label>Company Type</label>
              <input
                type="text"
                value={company.companyType || ""}
                onChange={(e) =>
                  setCompany({ ...company, companyType: e.target.value })
                }
              />
            </div>

            <div className="form-row">
              <label>Size</label>
              <input
                type="text"
                value={company.size || ""}
                onChange={(e) => setCompany({ ...company, size: e.target.value })}
              />
            </div>

            <div className="form-row">
              <label>Website</label>
              <input
                type="text"
                value={company.website || ""}
                onChange={(e) =>
                  setCompany({ ...company, website: e.target.value })
                }
              />
            </div>

            <div className="form-actions">
              <button onClick={handleSave} disabled={saving} className="save-btn">
                {saving ? "Saving..." : <FiCheck />}
              </button>
              <button
                onClick={() => {
                  setEditing(false);
                  setLogoFile(null);
                }}
                className="cancel-btn"
              >
                <FiX />
              </button>
            </div>
          </div>
        ) : (
          <div className="info-display">
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
      </section>

      {/* === ABOUT SECTION === */}
      <section className="info-section">
        <h2>About</h2>
        {editing ? (
          <textarea
            rows="4"
            value={company.description || ""}
            onChange={(e) =>
              setCompany({ ...company, description: e.target.value })
            }
          />
        ) : (
          <p>{company.description || "No description provided."}</p>
        )}
      </section>
    </div>
  );
}
