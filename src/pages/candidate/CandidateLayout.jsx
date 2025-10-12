// pages/candidate/CandidateLayout.jsx
import { Outlet } from "react-router-dom";
import CandidateHeader from "./common/header/CandidateHeader";
//import "./candidate.css";

export default function CandidateLayout() {
  return (
    <div className="candidate-page">
      <CandidateHeader />
      <div className="candidate-content">
        <Outlet /> {/* 👈 phần này sẽ thay đổi theo route con */}
      </div>
    </div>
  );
}
