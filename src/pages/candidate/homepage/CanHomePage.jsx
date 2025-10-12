import { useEffect, useState } from "react";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../../../firebase";
import SearchBar from "../../../components/searchBox/SearchBox";
import bannerImg from "../../../assets/can_home.png";
import "./canhome.css";
import JobList from "../jobList/JobList";
import JobFilter from "../jobFilter/JobFilter";

export default function CanHomePage() {
  const [jobs, setJobs] = useState([]);
  const [allJobs, setAllJobs] = useState([]);
  const [searching, setSearching] = useState(false);
  const [filters, setFilters] = useState({
    category: "",
    type: "",
    location: "",
  });

  useEffect(() => {
    const fetchJobs = async () => {
      const q = query(collection(db, "jobs"));
      const snapshot = await getDocs(q);
      const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setJobs(list);
      setAllJobs(list);
    };
    fetchJobs();
  }, []);

  const handleSearch = (queryText) => {
    if (!queryText.trim()) {
      setSearching(false);
      setJobs(allJobs);
      return;
    }
    setSearching(true);
    const filtered = allJobs.filter(
      (job) =>
        job.category?.toLowerCase().includes(queryText.toLowerCase()) ||
        job.title?.toLowerCase().includes(queryText.toLowerCase())
    );
    setJobs(filtered);
  };

  const applyFilters = () => {
    const filtered = allJobs.filter((job) => {
      const categoryMatch = filters.category.length === 0 || filters.category.includes(job.category);
      const typeMatch = filters.type.length === 0 || filters.type.includes(job.type);
      const locationMatch = filters.location.length === 0 || filters.location.includes(job.location);

      return categoryMatch && typeMatch && locationMatch;
    });
    setJobs(filtered);
  };

  return (
    <div className="can-home-page">
      <SearchBar onSearch={handleSearch} />

      {!searching && jobs.length === 0 ? (
        <div className="banner">
          <img src={bannerImg} alt="banner" />
          <div className="text">
            <h1>Welcome!</h1>
            <p>Find your dream job!</p>
          </div>
        </div>
      ) : (
        <div className="jobs-container">
          <JobFilter allJobs={allJobs} filters={filters} setFilters={setFilters} onApply={applyFilters} />
          <div className="joblist-wrapper">
            {jobs.length === 0 ? <p>No jobs match your filter.</p> : <JobList jobs={jobs} />}
          </div>
        </div>
      )}
    </div>
  );
}
