function Analytics() {
  const plan = localStorage.getItem("userPlan") || "Free";

  if (plan !== "Pro") {
    return (
      <div style={{ padding: "40px", color: "white" }}>
        <h1>Analytics</h1>
        <p style={{ marginTop: "20px", color: "#f87171" }}>
          This feature is available for Pro users only.
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: "40px", color: "white" }}>
      <h1>Analytics Dashboard 📊</h1>
      <p>Premium analytics data displayed here.</p>
    </div>
  );
}

export default Analytics;
