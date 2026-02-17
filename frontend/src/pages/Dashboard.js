import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Dashboard() {
  const navigate = useNavigate();

  const tenantId = localStorage.getItem("tenantId");
  const userEmail = localStorage.getItem("userEmail");
  const plan = localStorage.getItem("userPlan") || "Free";

  const [noteCount, setNoteCount] = useState(0);

  // Fetch notes count
  useEffect(() => {
    if (!tenantId) return;

    fetch(`http://localhost:5000/api/notes/${tenantId}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setNoteCount(data.length);
        } else {
          setNoteCount(0);
        }
      })
      .catch(() => setNoteCount(0));
  }, [tenantId]);

  return (
    <div style={{ display: "flex", height: "100vh" }}>

      {/* Sidebar */}
      <div style={{
        width: "220px",
        background: "#0f172a",
        color: "white",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "20px"
      }}>
        <h2 style={{ marginBottom: "30px" }}>🚀 SaaSify</h2>

        <p style={{ cursor: "pointer" }}>🏠 Home</p>

        <p style={{ cursor: "pointer" }} onClick={() => navigate("/notes")}>
          📝 Notes
        </p>

        <p style={{ cursor: "pointer" }} onClick={() => navigate("/subscription")}>
          💳 Subscription
        </p>

        <p style={{ cursor: "pointer" }} onClick={() => navigate("/billing")}>
          💰 Billing
        </p>

        <p style={{ cursor: "pointer" }} onClick={() => navigate("/analytics")}>
          📊 Analytics
        </p>

        <div style={{ marginTop: "auto" }}>
          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/login";
            }}
            style={{
              padding: "8px",
              width: "100%",
              background: "#ef4444",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer"
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        flex: 1,
        background: "#111827",
        color: "white",
        padding: "40px"
      }}>
        <h1>Welcome back 👋</h1>
        <p style={{ color: "#9ca3af" }}>{userEmail}</p>

        <div style={{
          marginTop: "40px",
          display: "flex",
          gap: "20px"
        }}>
          <div style={cardStyle}>
            <h3>Current Plan</h3>
            <p>{plan}</p>
          </div>

          <div style={cardStyle}>
            <h3>Total Notes</h3>
            <p>{noteCount}</p>
          </div>

          <div style={cardStyle}>
  <h3>Usage</h3>
  <p>
    {plan === "Free"
      ? `${(noteCount / 3) * 100}%`
      : "Unlimited"}
  </p>
</div>
        </div>
      </div>

    </div>
  );
}

const cardStyle = {
  background: "#1f2937",
  padding: "20px",
  borderRadius: "12px",
  width: "200px",
  boxShadow: "0 10px 20px rgba(0,0,0,0.3)"
};

export default Dashboard;
