import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CandidateHome from "./pages/candidate/CandidateHome";
import CandidateLogin from "./pages/candidate/CandidateLogin";
import CandidateRegister from "./pages/candidate/CandidateRegister";
import CandidateSetup from "./pages/candidate/CandidateSetup";
import CompanyHome from "./pages/company/CompanyHome";
import CompanyLogin from "./pages/company/CompanyLogin";
import CompanyRegister from "./pages/company/CompanyRegister";
import CompanySetup from "./pages/company/CompanySetup";
import CompanyPlan from "./pages/company/CompanyPlan";
import GetStarted from "./pages/GetStarted";
import LandingPage from "./pages/landingPage/Landing";
import JobDetail from "./pages/company/jobDetail/JobDetail";
import ManageJob from "./pages/company/manageJob/ManageJob";
import SavedJobsPage from "./pages/candidate/savedJob/SavedJobsPage";
import CandidateLayout from "./pages/candidate/CandidateLayout";
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/homepage" element={<HomePage/>} />
        {/* Candidate */}
         <Route path="/candidate/home" element={<CandidateLayout />}>
          <Route index element={<CandidateHome />} /> {/* /candidate/home */}
          <Route path="saved-jobs" element={<SavedJobsPage />} /> {/* /candidate/home/saved-jobs */}
        </Route>
        <Route path="/candidate/login" element={<CandidateLogin />} />
        <Route path="/candidate/register" element={<CandidateRegister />} />
        <Route path="/candidate/setup" element={<CandidateSetup />} />
       
        {/* Company */}
        <Route path="/company/login" element={<CompanyLogin />} />
        <Route path="/company/register" element={<CompanyRegister />} />
        <Route path="/company/home" element={<CompanyHome />} />
        <Route path="/company/setup" element={<CompanySetup />} />
        <Route path="/company/plan" element={<CompanyPlan />} />
        <Route path="/company/managejob" element={<ManageJob />} />
        

        {/* Default */}
        <Route path="/get-started" element={<GetStarted />} />
        <Route path="/company/home/job/:jobId" element={<JobDetail />} />
        {/*<Route path="*" element={<NotFound />} />*/}
      </Routes>
    </Router>
  );
}
