// CompanyReview.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase";
import CompanySearchBox from "../../company/search/CompanySearch";
import "./companyReview.css";

export default function CompanyReview() {
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const colRef = collection(db, "companies");
        const snapshot = await getDocs(colRef);
        const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCompanies(list);
        setFilteredCompanies(list);
      } catch (err) {
        console.error("Error fetching companies:", err);
      }
    };

    fetchCompanies();
  }, []);

  const handleSelectCompany = (company) => {
    navigate(`/candidate/home/review/${company.id}`);
  };

  return (
    <div className="company-review-page">
      <header className="company-review-header">
        <h1>Company Reviews</h1>
        <CompanySearchBox onSelectCompany={handleSelectCompany} />
      </header>

      <div className="company-list">
        {filteredCompanies.map((c) => (
          <div
            key={c.id}
            className="company-card"
            onClick={() => navigate(`/candidate/home/review/${c.id}`)}
          >
            <img
              src={c.logoUrl || "/default-logo.png"}
              alt={c.companyName || c.name}
              className="company-logo"
            />
            <div className="company-info">
              <h3>{c.companyName || c.name}</h3>
              <p>{c.industry || "No industry info"}</p>
              <p>{c.address || "No address info"}</p>
              <p>{c.companySize || c.size || "Unknown size"}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
