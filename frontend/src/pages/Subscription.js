import { useEffect, useState } from "react";

function Subscription() {

  const [plan, setPlan] = useState("Free");
  const email = localStorage.getItem("userEmail");

// useEffect(() => {
//   fetch(`http://localhost:5000/api/auth/me/${email}`)
//     .then(res => res.json())
//     .then(data => setPlan(data.plan));
// }, [email]);


  const upgradePlan = async () => {
    await fetch("http://localhost:5000/api/auth/upgrade", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });

    alert("Upgraded to Pro 🚀");

localStorage.setItem("userPlan", "Pro");  // 👈 ADD THIS LINE

setPlan("Pro");

  };

  return (
    <div style={{ padding: "40px", color: "white" }}>
      <h1>Subscription Plans</h1>

      <h3 style={{ marginTop: "20px" }}>
        Current Plan: {plan}
      </h3>

      <div style={{ display: "flex", gap: "30px", marginTop: "40px" }}>

        <div style={cardStyle}>
          <h2>Free</h2>
          <p>Basic features</p>
          <p>Limited access</p>
        </div>

        <div style={cardStyle}>
          <h2>Pro</h2>
          <p>All premium features</p>
          <p>Unlimited access</p>

          

            <button onClick={upgradePlan} style={btnStyle}>
              Upgrade
            </button>
          
        </div>

      </div>
    </div>
  );
}

const cardStyle = {
  background: "#1f2937",
  padding: "30px",
  borderRadius: "12px",
  width: "250px",
  boxShadow: "0 10px 20px rgba(0,0,0,0.3)"
};

const btnStyle = {
  marginTop: "20px",
  padding: "12px",
  width: "100%",
  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
  letterSpacing: "0.5px",
  transition: "all 0.3s ease"
};



export default Subscription;
