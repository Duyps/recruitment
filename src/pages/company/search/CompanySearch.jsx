// CompanySearchBox.jsx
import { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase";
import "./search.css";

export default function CompanySearchBox({ onSelectCompany }) {
  const [query, setQuery] = useState("");
  const [companies, setCompanies] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Lấy dữ liệu companies từ Firestore
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const colRef = collection(db, "companies");
        const snapshot = await getDocs(colRef);
        const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCompanies(list);
      } catch (err) {
        console.error("Error fetching companies:", err);
      }
    };

    fetchCompanies();
  }, []);

  // Lọc gợi ý dựa trên query
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    const filtered = companies.filter((c) =>
      (c.companyName || c.name || "")
        .toLowerCase()
        .includes(query.toLowerCase())
    );
    setSuggestions(filtered.slice(0, 5)); // giới hạn 5 gợi ý
  }, [query, companies]);

  const handleSelectSuggestion = (company) => {
    setQuery(company.companyName || company.name);
    setShowSuggestions(false);
    if (onSelectCompany) onSelectCompany(company);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      const match = companies.find(
        (c) =>
          (c.companyName || c.name || "").toLowerCase() === query.toLowerCase()
      );
      if (match && onSelectCompany) onSelectCompany(match);
    }
    setShowSuggestions(false);
  };

  return (
    <div className="search-bar">
      <form onSubmit={handleSearch}>
        <FiSearch size={20} />
        <input
          type="text"
          placeholder="Company name"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowSuggestions(true);
          }}
        />
        <button type="submit">Find</button>
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <ul className="suggestion-list">
          {suggestions.map((c) => (
            <li key={c.id} onClick={() => handleSelectSuggestion(c)}>
              <FiSearch size={15} /> {c.companyName || c.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
