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
import CandidateAccount from "./pages/candidate/profile/CandidateProfile";
import CompanyReview from "./pages/candidate/companyReview/CompanyReview";
import CompanyPublicInfo from "./pages/candidate/companyReview/CompanyPublicInfo";
import CompanyProfile from "./pages/company/manageProfile/CompanyProfile";
import CreateJob from "./pages/company/createJob/CreateJob";

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
          <Route path="account" element={<CandidateAccount />} /> {/* /candidate/home/saved-jobs */}
          <Route path="review" element={<CompanyReview/>} /> {/* /candidate/home/saved-jobs */}
          <Route path="review/:companyId" element={<CompanyPublicInfo />} />

        </Route>
        <Route path="/candidate/login" element={<CandidateLogin />} />
        <Route path="/candidate/register" element={<CandidateRegister />} />
        <Route path="/candidate/setup" element={<CandidateSetup />} />
       
        {/* Company */}
        <Route path="/company/home" element={<CompanyHome />}>
          <Route path="create" element={<CreateJob />} /> 
          <Route path="jobs" element={<ManageJob />} /> 
          <Route path="profile" element={<CompanyProfile/>} />
          <Route path="jobs/:jobId" element={<JobDetail />} />
        </Route>

        <Route path="/company/login" element={<CompanyLogin />} />
        <Route path="/company/register" element={<CompanyRegister />} />
        <Route path="/company/setup" element={<CompanySetup />} />
        <Route path="/company/plan" element={<CompanyPlan />} />
        

        {/* Default */}
        <Route path="/get-started" element={<GetStarted />} />
        {/*<Route path="*" element={<NotFound />} />*/}
      </Routes>
    </Router>
  );
}
