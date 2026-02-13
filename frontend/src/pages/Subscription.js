function Subscription() {

  const currentPlan = localStorage.getItem("userPlan") || "Free";

  const upgradePlan = async () => {
    const email = localStorage.getItem("userEmail");

    await fetch("http://localhost:5000/api/auth/upgrade", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });

    localStorage.setItem("userPlan", "Pro");
    alert("Upgraded to Pro 🚀");
    window.location.reload();
  };

  return (
    <div style={{ padding: "40px", color: "white" }}>
      <h1>Subscription Plans</h1>

      <h3 style={{ marginTop: "20px" }}>
        Current Plan: {currentPlan}
      </h3>

      <div style={{ display: "flex", gap: "30px", marginTop: "40px" }}>

        {/* Free Plan */}
        <div style={cardStyle}>
          <h2>Free</h2>
          <p>Basic features</p>
          <p>Limited access</p>
        </div>

        {/* Pro Plan */}
        <div style={cardStyle}>
          <h2>Pro</h2>
          <p>All premium features</p>
          <p>Unlimited access</p>

          {currentPlan === "Free" && (
            <button onClick={upgradePlan} style={btnStyle}>
              Upgrade
            </button>
          )}
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
  padding: "10px",
  width: "100%",
  background: "#6366f1",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
};

export default Subscription;
