import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CandidateLogin from "./pages/candidate/CandidateLogin";
import CandidateRegister from "./pages/candidate/CandidateRegister";
import CandidateHome from "./pages/candidate/CandidateHome";
import CompanyLogin from "./pages/company/CompanyLogin";
import CompanyRegister from "./pages/company/CompanyRegister";
import CompanyHome from "./pages/company/CompanyHome";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* Candidate */}
        <Route path="/candidate/login" element={<CandidateLogin />} />
        <Route path="/candidate/register" element={<CandidateRegister />} />
        <Route path="/candidate/home" element={<CandidateHome />} />
        {/* Company */}
        <Route path="/company/login" element={<CompanyLogin />} />
        <Route path="/company/register" element={<CompanyRegister />} />
        <Route path="/company/home" element={<CompanyHome />} />
        {/* Default */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
