import { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";

export default function CompanyHome() {
  const [company, setCompany] = useState(null);

  useEffect(() => {
    const fetchCompany = async () => {
      const user = auth.currentUser;
      if (!user) return;
      const docSnap = await getDoc(doc(db, "companies", user.uid));
      if (docSnap.exists()) {
        setCompany(docSnap.data());
      }
    };
    fetchCompany();
  }, []);

  if (!company) return <p>Loading...</p>;

  return (
    <div className="home-page">
      <h2>Welcome, {company.companyName} 🎉</h2>
      <p>Plan: {company.planSelected}</p>
      <p>Industry: {company.industry}</p>
      <p>Recruiter: {company.recruiterName}</p>
      <p>Phone: {company.phone}</p>
      <p>Description: {company.description}</p>
    </div>
  );
}
