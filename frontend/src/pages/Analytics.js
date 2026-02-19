import { useEffect, useState } from "react";

function Analytics() {
  const tenantId = localStorage.getItem("tenantId");
  const plan = localStorage.getItem("userPlan") || "Free";

  const [notesCount, setNotesCount] = useState(0);
  const [teamCount, setTeamCount] = useState(0);

  useEffect(() => {
    if (!tenantId) return;

    // Fetch notes count
    fetch(`http://localhost:5000/api/notes/${tenantId}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setNotesCount(data.length);
        }
      });

    // Fetch team count
    fetch(`http://localhost:5000/api/auth/team/${tenantId}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setTeamCount(data.length);
        }
      });
  }, [tenantId]);

  if (plan !== "Pro") {
    return (
      <div style={container}>
        <h1>Analytics</h1>
        <p style={{ color: "#f87171", marginTop: "20px" }}>
          This feature is available for Pro users only.
        </p>
      </div>
    );
  }

  return (
    <div style={container}>
      <h1 style={{ fontSize: "32px", marginBottom: "40px" }}>
        📊 Analytics Dashboard
      </h1>

      <div style={cardContainer}>
        <div style={card}>
          <h3>Total Notes</h3>
          <p style={bigText}>{notesCount}</p>
        </div>

        <div style={card}>
          <h3>Total Team Members</h3>
          <p style={bigText}>{teamCount}</p>
        </div>

        <div style={card}>
          <h3>Workspace Status</h3>
          <p style={{ color: "#22c55e", fontWeight: "600" }}>
            Active 🚀
          </p>
        </div>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const container = {
  minHeight: "100vh",
  padding: "60px",
  background: "#111827",
  color: "white"
};

const cardContainer = {
  display: "flex",
  gap: "30px",
  flexWrap: "wrap"
};

const card = {
  background: "#1f2937",
  padding: "35px",
  borderRadius: "16px",
  width: "260px",
  boxShadow: "0 20px 40px rgba(0,0,0,0.35)"
};

const bigText = {
  fontSize: "32px",
  fontWeight: "700",
  marginTop: "10px"
};

export default Analytics;
