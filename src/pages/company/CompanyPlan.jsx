import { auth, db } from "../../firebase";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function CompanyPlan() {
  const navigate = useNavigate();

  const plans = [
    {
      name: "Starter",
      price: "Free",
      benefits: ["1 job post", "View 5 candidate profiles", "Basic Support"],
    },
    {
      name: "Pro",
      price: "299,000₫ / month",
      benefits: ["10 job posts", "Unlimited candidate views", "Highlighted company"],
    },
    {
      name: "Enterprise",
      price: "699,000₫ / month",
      benefits: ["Unlimited jobs", "Analytics", "Priority Support"],
    },
  ];

  const handleSelect = async (planName) => {
    const user = auth.currentUser;
    if (!user) return alert("Please login first");

    const ref = doc(db, "companies", user.uid);
    await setDoc(
      ref,
      {
        planName: planName
        
      },
      { merge: true } // ✅ nếu document chưa tồn tại thì tự tạo
    );

    navigate("/company/setup");
  };

  return (
    <div className="plan-page">
      <h2>Choose Your Plan 💼</h2>
      <div className="plan-container">
        {plans.map((plan) => (
          <div className="plan-card" key={plan.name}>
            <h3>{plan.name}</h3>
            <p>{plan.price}</p>
            <ul>
              {plan.benefits.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
            <button onClick={() => handleSelect(plan.name)}>Select</button>
          </div>
        ))}
      </div>
    </div>
  );
}
