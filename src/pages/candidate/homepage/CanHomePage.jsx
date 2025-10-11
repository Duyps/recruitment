import { useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import {db} from '../../../firebase';
import SearchBar from "../../../components/searchBox/SearchBox";
import bannerImg from  '../../../assets/can_home.png';
import './canhome.css';
import JobList from "../jobList/JobList";

export default function CanHomePage() {
  const [jobs, setJobs] = useState([]);
  const [searching, setSearching] = useState(false);

  const handleSearch = async (queryText) => {
    if (!queryText.trim()) {
      setSearching(false);
      return;
    }

    setSearching(true);

    // Lấy tất cả job có catalog hoặc title chứa từ khóa
    const q = query(collection(db, "jobs"));
    const snapshot = await getDocs(q);
    const list = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter(
        (job) =>
          job.category?.toLowerCase().includes(queryText.toLowerCase()) ||
          job.title?.toLowerCase().includes(queryText.toLowerCase())
      );

    setJobs(list);
  };

  return (
    <div className="can-home-page">
      <SearchBar onSearch={handleSearch} />

      {!searching ? (
        <div className="banner">
          <img
            src={bannerImg}
            alt="banner"
          />
          <div className="text">
            <h1>Welcome!</h1>
            <p>Let's sf </p>
          </div>
        </div>
      ) : (
        <div>
          {jobs.length === 0 ? (
            <p>No jobs found for your search.</p>
          ) : (
            <JobList jobs={jobs}/>
          )}
        </div>
      )}
    </div>
  );
}