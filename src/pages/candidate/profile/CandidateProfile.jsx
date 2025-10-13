import { useEffect, useState } from "react";
import { auth, db } from "../../../firebase";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { FiEdit2, FiPlus, FiCheck, FiX } from "react-icons/fi"; // Added FiCheck/FiX for save/cancel
import "./profile.css";

export default function CandidateAccount() {
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [cvFile, setCvFile] = useState(null);
  const [editSection, setEditSection] = useState(null); // 'header-name' | 'education' | 'about' | 'skills' | null
  
  // State to temporarily hold changes during editing
  const [tempFullName, setTempFullName] = useState("");
  const [tempTitle, setTempTitle] = useState("");

  const user = auth.currentUser;

  // 🧩 Fetch candidate data
  useEffect(() => {
    const fetchCandidate = async () => {
      if (!user) return;
      try {
        const docRef = doc(db, "candidates", user.uid);
        const snap = await getDoc(docRef);
        const data = snap.exists() ? snap.data() : { 
          email: user.email, fullName: "", about: "", skills: [], 
          education: "", title: "", avatarUrl: "", cvUrl: "" 
        };
        
        setCandidate(data);
        setTempFullName(data.fullName || "");
        setTempTitle(data.title || "");
        
      } catch (err) {
        console.error("Error fetching:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCandidate();
  }, [user]);

  // ☁ Upload to Cloudinary
  const uploadToCloudinary = async (file, resourceType = "auto") => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "cruitment");
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/dxgaqawwy/${resourceType}/upload`,
      { method: "POST", body: formData }
    );
    const data = await res.json();
    if (!data.secure_url) throw new Error("Upload failed");
    return data.secure_url;
  };

  // 💾 Save data to Firestore
  const handleSave = async (sectionKey) => {
    if (!user || !candidate) return;
    setSaving(true);
    
    try {
      let updateData = { ...candidate };

      if (sectionKey === "header-name") {
          updateData.fullName = tempFullName;
          updateData.title = tempTitle;
          
          if (avatarFile) {
            updateData.avatarUrl = await uploadToCloudinary(avatarFile, "image");
            setAvatarFile(null); // Clear file after successful upload
          }
      }
      // Apply other section updates if necessary
      
      if (cvFile) {
        updateData.cvUrl = await uploadToCloudinary(cvFile, "auto");
        setCvFile(null); // Clear file after successful upload
      }

      await updateDoc(doc(db, "candidates", user.uid), {
        ...updateData,
        updatedAt: serverTimestamp(),
      });
      
      // Update the main state with the new data
      setCandidate(updateData); 
      setEditSection(null);
      alert("✅ Profile updated!");
    } catch (err) {
      console.error("Update failed:", err);
      alert("❌ Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };
  
  const handleCancelEdit = (sectionKey) => {
      if (sectionKey === "header-name") {
          // Reset temporary states to current candidate data
          setTempFullName(candidate.fullName || "");
          setTempTitle(candidate.title || "");
          setAvatarFile(null); // Also clear the temporary avatar selection
      }
      setEditSection(null);
  };

  if (loading) return <p>Loading...</p>;
  if (!candidate) return <p>No candidate data found.</p>;

  return (
    <div className="candidate-profile">
      {/* --- HEADER --- */}
      <div className="profile-header">
        <div className="header-top">
          <div className="avatar-name-section">
            <div className="avatar-wrapper">
              <img
                src={
                  // Use temp avatar file for immediate preview
                  avatarFile
                    ? URL.createObjectURL(avatarFile)
                    : candidate.avatarUrl || "/default-avatar.png"
                }
                alt="avatar"
                className="profile-avatar"
              />
              <label className="edit-avatar-btn" title="Change Avatar">
                <FiEdit2 size={12} />
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => setAvatarFile(e.target.files[0])}
                />
              </label>
            </div>
            
            <div className="header-info">
              {editSection === 'header-name' ? (
                // Edit Mode
                <div className="edit-name-title-mode">
                    <input
                        type="text"
                        value={tempFullName}
                        onChange={(e) => setTempFullName(e.target.value)}
                        placeholder="Full Name"
                    />
                    <input
                        type="text"
                        value={tempTitle}
                        onChange={(e) => setTempTitle(e.target.value)}
                        placeholder="Professional Title"
                    />
                    <div className="edit-actions">
                        <button 
                            onClick={() => handleSave('header-name')} 
                            disabled={saving} 
                            className="save-btn"
                        >
                            {saving ? "Saving..." : <FiCheck />}
                        </button>
                        <button 
                            onClick={() => handleCancelEdit('header-name')} 
                            className="cancel-btn"
                        >
                            <FiX />
                        </button>
                    </div>
                </div>
              ) : (
                // View Mode
                <div className="view-name-title-mode">
                    <div className="name-and-edit">
                        <h2>{candidate.fullName || "Your Name"}</h2>
                        <button 
                            className="edit-icon-small" 
                            onClick={() => setEditSection('header-name')}
                            title="Edit Name and Title"
                        >
                            <FiEdit2 size={16} />
                        </button>
                    </div>
                    <p>{candidate.title || "Your professional title"}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* --- BODY: 2 COLUMNS (Same as before) --- */}
      <div className="profile-body">
        {/* LEFT COLUMN */}
        <div className="profile-left">
          
          {/* Education Section */}
          <div className="section-block education-section">
            <div className="section-title">
              <h3>Education</h3>
              <button
                className="edit-icon"
                onClick={() => setEditSection("education")}
              >
                <FiEdit2 />
              </button>
            </div>
            {editSection === "education" ? (
              <div className="edit-mode">
                <input
                  type="text"
                  value={candidate.education || ""}
                  onChange={(e) =>
                    setCandidate({ ...candidate, education: e.target.value })
                  }
                />
                <button
                  onClick={() => handleSave("education")}
                  disabled={saving}
                  className="save-btn-small"
                >
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            ) : (
              <p>{candidate.education || "Add your education background"}</p>
            )}
          </div>

          {/* CV Upload Section */}
          <div className="section-block cv-upload-section">
            <div className="section-title">
              <h3>CV / Resume</h3>
              <label className="add-icon" title="Upload CV">
                <FiPlus />
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  hidden
                  onChange={(e) => setCvFile(e.target.files[0])}
                />
              </label>
            </div>
            {candidate.cvUrl ? (
              <a
                href={candidate.cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="cv-link"
              >
                View Current CV
              </a>
            ) : (
              <p>No CV uploaded</p>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="profile-right">
          
          {/* About Section */}
          <div className="section-block about-section">
            <div className="section-title">
              <h3>About</h3>
              <button
                className="edit-icon"
                onClick={() => setEditSection("about")}
              >
                <FiEdit2 />
              </button>
            </div>
            {editSection === "about" ? (
              <div className="edit-mode">
                <textarea
                  rows="6"
                  value={candidate.about || ""}
                  onChange={(e) =>
                    setCandidate({ ...candidate, about: e.target.value })
                  }
                />
                <button
                  onClick={() => handleSave("about")}
                  disabled={saving}
                  className="save-btn-small"
                >
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            ) : (
              <p>{candidate.about || "Write something about yourself."}</p>
            )}
          </div>

          {/* Skills Section */}
          <div className="section-block skills-section">
            <div className="section-title">
              <h3>Skills</h3>
              <button
                className="edit-icon"
                onClick={() => setEditSection("skills")}
              >
                <FiEdit2 />
              </button>
            </div>
            {editSection === "skills" ? (
              <div className="edit-mode">
                <input
                  type="text"
                  placeholder="e.g. HTML, CSS, JavaScript"
                  value={
                    Array.isArray(candidate.skills)
                      ? candidate.skills.join(", ")
                      : candidate.skills || ""
                  }
                  onChange={(e) =>
                    setCandidate({
                      ...candidate,
                      skills: e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter((s) => s),
                    })
                  }
                />
                <button
                  onClick={() => handleSave("skills")}
                  disabled={saving}
                  className="save-btn-small"
                >
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            ) : (
              <div className="skills-list">
                {(Array.isArray(candidate.skills)
                  ? candidate.skills
                  : []
                ).map((skill, i) => (
                  <span key={i} className="skill-tag">
                    {skill}
                  </span>
                ))}
                {(!candidate.skills || candidate.skills.length === 0) && (
                  <p>No skills added.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}