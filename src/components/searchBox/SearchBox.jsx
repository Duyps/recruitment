import { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import { catalogList } from "../../data/catalogList";
import "./searchBox.css";

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Gợi ý từ catalogList khi người dùng nhập
  useEffect(() => {
    if (query.trim() === "") {
      setSuggestions([]);
      return;
    }

    const filtered = catalogList.filter((item) =>
      item.toLowerCase().includes(query.toLowerCase())
    );
    setSuggestions(filtered.slice(0, 5)); // Giới hạn 5 gợi ý
  }, [query]);

  // 👉 Chỉ chọn gợi ý, không gọi onSearch
  const handleSelectSuggestion = (text) => {
    setQuery(text);
    setShowSuggestions(false);
  };

  // 👉 Bắt đầu tìm kiếm khi nhấn Enter hoặc nút "Find Job"
  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim() && onSearch) {
      onSearch(query.trim());
    }
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
        <button type="submit">Find Job</button>
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <ul className="suggestion-list">
          {suggestions.map((s, i) => (
            <li key={i} onClick={() => handleSelectSuggestion(s)}>
              <FiSearch size={15} />
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}


