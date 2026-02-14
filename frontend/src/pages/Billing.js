function Billing() {
  const plan = localStorage.getItem("userPlan") || "Free";

  return (
    <div style={{ padding: "40px", color: "white" }}>
      <h1>Billing & Payments</h1>

      <h3 style={{ marginTop: "20px" }}>
        Current Plan: {plan}
      </h3>

      <div style={{
        marginTop: "30px",
        background: "#1f2937",
        padding: "20px",
        borderRadius: "12px"
      }}>
        <h3>Payment History</h3>

        {plan === "Pro" ? (
          <p>✔ Pro Plan Activated</p>
        ) : (
          <p>No payments yet.</p>
        )}
      </div>
    </div>
  );
}

export default Billing;
