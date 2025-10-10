import { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import './searchBox.css';

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Đây là danh sách gợi ý mẫu (catalog có thể lấy từ Firestore sau)
  const catalog = [
    "AI Engineer",
    "Artificial Intelligence",
    "Machine Learning",
    "Deep Learning",
    "Frontend Developer",
    "Backend Developer",
    "Fullstack Developer",
    "Mobile Developer",
    "Flutter Developer",
    "ReactJS Developer",
    "Data Analyst",
    "Data Scientist",
    "DevOps Engineer",
    "UI/UX Designer",
    "Product Manager",
  ];

  useEffect(() => {
    if (query.trim() === "") {
      setSuggestions([]);
      return;
    }

    const filtered = catalog.filter((item) =>
      item.toLowerCase().includes(query.toLowerCase())
    );
    setSuggestions(filtered.slice(0, 5)); // chỉ hiện tối đa 5 gợi ý
  }, [query]);

  const handleSelectSuggestion = (text) => {
    setQuery(text);
    setShowSuggestions(false);
    if (onSearch) onSearch(text);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(query);
    setShowSuggestions(false);
  };

  return (
    <div className="search-bar">
      <form onSubmit={handleSearch}>
        <FiSearch size={20} />
        <input
          type="text"
          placeholder="Job title or keywords"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowSuggestions(true);
          }}
        />
        <button>Find Job</button>
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <ul
        >
          {suggestions.map((s, i) => (
            <li
              key={i}
              onClick={() => handleSelectSuggestion(s)}
              
            >
              <FiSearch size={15} />
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
