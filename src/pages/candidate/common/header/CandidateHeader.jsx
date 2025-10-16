import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiBookmark, FiChevronDown, FiLogOut, FiUser } from "react-icons/fi";
import { auth, db } from "../../../../firebase";
import { doc, getDoc } from "firebase/firestore";
import './header.css';
import defaultAvatar from "../../../../assets/avatar.png";

export default function CandidateHeader() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(defaultAvatar);
  const menuRef = useRef(null);

  const user = auth.currentUser;

  // Fetch avatar from Firestore
  useEffect(() => {
    const fetchAvatar = async () => {
      if (!user) return;
      try {
        const docRef = doc(db, "candidates", user.uid);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const data = snap.data();
          setAvatarUrl(data.avatarUrl || user.photoURL || defaultAvatar);
        }
      } catch (error) {
        console.error("Error fetching avatar:", error);
      }
    };
    fetchAvatar();
  }, [user]);

  // Ẩn menu khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/");
  };

  return (
    <header className="candidate-header">
      <div className="header-left">
        <p className="logo-text" onClick={() => navigate("/candidate/home")}>
          Logo Ở đây
        </p>
        <button onClick={() => navigate("/candidate/home")}>Home</button>
        <button onClick={() => navigate("/candidate/home/review")}>
          Company Review
        </button>
      </div>

      <nav className="header-right">
        {/* Saved Jobs icon */}
        <button
          className="icon-btn"
          title="Saved Jobs"
          onClick={() => navigate("/candidate/home/saved-jobs")}
        >
          <FiBookmark size={20} />
        </button>

        {/* Account avatar + dropdown */}
        <div className="account-menu" ref={menuRef}>
          <div
            className="account-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <img
              src={avatarUrl}
              alt="avatar"
              className="header-avatar"
            />
            <FiChevronDown
              className={`arrow-icon ${menuOpen ? "open" : ""}`}
              size={18}
            />
          </div>

          {menuOpen && (
            <div className="dropdown-menu">
              <button
                className="dropdown-item"
                onClick={() => {
                  navigate("/candidate/home/account");
                  setMenuOpen(false);
                }}
              >
                <FiUser /> Quản lý thông tin
              </button>
              <button className="dropdown-item" onClick={handleLogout}>
                <FiLogOut /> Đăng xuất
              </button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
