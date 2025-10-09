import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";

export default function CandidateHome() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const ref = collection(db, "companies");
        const snap = await getDocs(ref);
        const data = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCompanies(data);
      } catch (err) {
        console.error("Error fetching companies:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  if (loading) return <p style={{ textAlign: "center" }}>Loading companies...</p>;

  return (
    <div style={{ padding: "40px", background: "#f8f9fa", minHeight: "100vh" }}>
      <h2 style={{ textAlign: "center", marginBottom: "30px" }}>🏢 All Companies</h2>

      {companies.length === 0 ? (
        <p style={{ textAlign: "center", color: "#888" }}>No companies found.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          {companies.map(company => (
            <div key={company.id} className="company-card">
              <img src={company.logoUrl} alt={company.name} />
              <h3>{company.companyName}</h3>
              <p>{company.industry}</p>
              <p>{company.address}</p>
            </div>
          ))}

        </div>
      )}
    </div>
  );
}
