import { useState } from "react";
import CandidateHeader from "./common/header/CandidateHeader";
import SearchBar from "../../components/searchBox/SearchBox";
import CanHomePage from "./homepage/CanHomePage";
import './candidate.css';
import SavedJobsPage from "./savedJob/SavedJobsPage";


export default function CandidatePage() {
  return (
    <div className="candidate-page">
      <CandidateHeader />
      <CanHomePage/>
    </div>
  );
}
