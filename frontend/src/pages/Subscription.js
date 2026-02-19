import { useState, useEffect } from "react";

function Subscription() {
  const email = localStorage.getItem("userEmail");

  const [plan, setPlan] = useState(
    localStorage.getItem("userPlan") || "Free"
  );

  const [billingCycle, setBillingCycle] = useState(
    localStorage.getItem("billingCycle") || "Monthly"
  );

  // ===============================
  // Upgrade Plan
  // ===============================
  const upgradePlan = async () => {
    try {
      await fetch("http://localhost:5000/api/auth/upgrade", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      localStorage.setItem("userPlan", "Pro");
      setPlan("Pro");

      alert("Upgraded to Pro 🚀");
    } catch (err) {
      alert("Upgrade failed");
    }
  };

  // ===============================
  // Change Billing Cycle
  // ===============================
  const changeBilling = async (cycle) => {
    try {
      await fetch("http://localhost:5000/api/auth/billing-cycle", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          billingCycle: cycle
        })
      });

      localStorage.setItem("billingCycle", cycle);
      setBillingCycle(cycle);

      alert("Billing updated to " + cycle);
    } catch (err) {
      alert("Billing update failed");
    }
  };

  return (
    <div style={containerStyle}>
      <h1 style={{ fontSize: "32px", marginBottom: "20px" }}>
        Subscription Plans
      </h1>

      <h3>
        Current Plan: <span style={{ color: "#22c55e" }}>{plan}</span>
      </h3>

      <h4 style={{ marginTop: "10px", color: "#9ca3af" }}>
        Billing Cycle: {billingCycle}
      </h4>

      {/* Billing Toggle */}
      <div style={{ marginTop: "20px" }}>
        <button
          onClick={() => changeBilling("Monthly")}
          style={billingBtn}
        >
          Monthly
        </button>

        <button
          onClick={() => changeBilling("Yearly")}
          style={{ ...billingBtn, marginLeft: "10px" }}
        >
          Yearly
        </button>
      </div>

      {/* Plans */}
      <div style={cardContainer}>

        {/* Free Plan */}
        <div style={cardStyle}>
          <h2>Free</h2>
          <p>✔ 3 Notes Limit</p>
          <p>✔ Basic Features</p>
          <p>❌ Analytics</p>
        </div>

        {/* Pro Plan */}
        <div style={cardStyle}>
          <h2>Pro</h2>
          <p>✔ Unlimited Notes</p>
          <p>✔ Team Management</p>
          <p>✔ Analytics</p>

          {plan === "Free" && (
            <button
              onClick={upgradePlan}
              style={upgradeBtn}
            >
              Upgrade to Pro 🚀
            </button>
          )}
        </div>

      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const containerStyle = {
  minHeight: "100vh",
  padding: "50px",
  background: "#111827",
  color: "white"
};

const cardContainer = {
  display: "flex",
  gap: "30px",
  marginTop: "40px"
};

const cardStyle = {
  background: "#1f2937",
  padding: "30px",
  borderRadius: "16px",
  width: "260px",
  boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
};

const upgradeBtn = {
  marginTop: "20px",
  padding: "12px",
  width: "100%",
  borderRadius: "8px",
  border: "none",
  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
  color: "white",
  fontWeight: "600",
  cursor: "pointer"
};

const billingBtn = {
  padding: "8px 16px",
  borderRadius: "8px",
  border: "none",
  background: "#334155",
  color: "white",
  cursor: "pointer"
};

export default Subscription;
