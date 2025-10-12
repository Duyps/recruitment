import React from "react";
import "./jobFilter.css";

export default function JobFilter({ allJobs, filters, setFilters, onApply }) {
  // Lấy giá trị unique
  const categories = [...new Set(allJobs.map((j) => j.category))].filter(Boolean);
  const types = [...new Set(allJobs.map((j) => j.type))].filter(Boolean);
  const locations = [...new Set(allJobs.map((j) => j.location))].filter(Boolean);

  const handleCheckboxChange = (name, value) => {
    setFilters((prev) => {
      const current = prev[name];
      if (current.includes(value)) {
        // Bỏ tick
        return { ...prev, [name]: current.filter((v) => v !== value) };
      } else {
        // Tick thêm
        return { ...prev, [name]: [...current, value] };
      }
    });
  };

  return (
    <aside className="job-filter">
      <h3>Filter Jobs</h3>

      <div className="filter-group">
        <h4>Category</h4>
        {categories.map((cat, i) => (
          <label key={i} className="filter-checkbox">
            <input
              type="checkbox"
              checked={filters.category.includes(cat)}
              onChange={() => handleCheckboxChange("category", cat)}
            />
            {cat}
          </label>
        ))}
      </div>

      <div className="filter-group">
        <h4>Job Type</h4>
        {types.map((type, i) => (
          <label key={i} className="filter-checkbox">
            <input
              type="checkbox"
              checked={filters.type.includes(type)}
              onChange={() => handleCheckboxChange("type", type)}
            />
            {type}
          </label>
        ))}
      </div>

      <div className="filter-group">
        <h4>Location</h4>
        {locations.map((loc, i) => (
          <label key={i} className="filter-checkbox">
            <input
              type="checkbox"
              checked={filters.location.includes(loc)}
              onChange={() => handleCheckboxChange("location", loc)}
            />
            {loc}
          </label>
        ))}
      </div>

      <button onClick={onApply}>Apply Filters</button>
    </aside>
  );
}
