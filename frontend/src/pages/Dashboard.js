import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Dashboard() {
  const navigate = useNavigate();

  const tenantId = localStorage.getItem("tenantId");
  const userEmail = localStorage.getItem("userEmail");
  const plan = localStorage.getItem("userPlan") || "Free";
  const role = localStorage.getItem("userRole");
  const billingCycle = localStorage.getItem("billingCycle") || "Monthly";

  const [noteCount, setNoteCount] = useState(0);
  const [memberCount, setMemberCount] = useState(0);

  /* ================= FETCH NOTES ================= */
  useEffect(() => {
    if (!tenantId) return;

    fetch(`http://localhost:5000/api/notes/${tenantId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
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

  /* ================= FETCH TEAM COUNT (ADMIN ONLY) ================= */
  useEffect(() => {
    if (!tenantId || role !== "Admin") return;

    fetch(`http://localhost:5000/api/auth/team/${tenantId}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setMemberCount(data.length);
        } else {
          setMemberCount(0);
        }
      })
      .catch(() => setMemberCount(0));
  }, [tenantId, role]);

  return (
    <div style={wrapperStyle}>

      {/* SIDEBAR */}
      <div style={sidebarStyle}>
        <h2 style={{ marginBottom: "30px" }}>🚀 SaaSify</h2>

        <p style={menuItem} onClick={() => navigate("/dashboard")}>🏠 Home</p>
        <p style={menuItem} onClick={() => navigate("/notes")}>📝 Notes</p>
        <p style={menuItem} onClick={() => navigate("/subscription")}>💳 Subscription</p>
        <p style={menuItem} onClick={() => navigate("/billing")}>💰 Billing</p>
        <p style={menuItem} onClick={() => navigate("/analytics")}>📊 Analytics</p>
        <p style={menuItem} onClick={() => navigate("/team")}>👥 Team</p>
        <p style={menuItem} onClick={() => navigate("/activity")}>📜 Activity</p>
        <p style={menuItem} onClick={() => navigate("/settings")}>⚙ Settings</p>

        <div style={{ marginTop: "auto" }}>
          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/login";
            }}
            style={logoutBtn}
          >
            Logout
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={mainStyle}>
        <h1 style={{ fontSize: "32px", fontWeight: "700" }}>
          Welcome back 👋
        </h1>

        <p style={{ color: "#9ca3af", marginBottom: "40px" }}>
          {userEmail}
        </p>

        <div style={cardContainer}>

          {/* PLAN */}
          <div style={cardStyle}>
            <h3>Current Plan</h3>
            <p style={bigText}>{plan}</p>
            <p style={{ color: "#9ca3af", marginTop: "5px" }}>
              {billingCycle} Billing
            </p>
          </div>

          {/* NOTES */}
          <div style={cardStyle}>
            <h3>Total Notes</h3>
            <p style={bigText}>{noteCount}</p>
          </div>

          {/* MEMBERS (ADMIN ONLY) */}
          {role === "Admin" && (
            <div style={cardStyle}>
              <h3>Total Members</h3>
              <p style={bigText}>{memberCount}</p>
            </div>
          )}

          {/* USAGE */}
          <div style={cardStyle}>
            <h3>Usage</h3>

            {plan === "Free" ? (
              <>
                <div style={progressBarBg}>
                  <div
                    style={{
                      ...progressBarFill,
                      width: `${Math.min((noteCount / 3) * 100, 100)}%`
                    }}
                  />
                </div>

                <p style={{ marginTop: "12px", color: "#9ca3af" }}>
                  {noteCount} / 3 Notes Used
                </p>
              </>
            ) : (
              <p style={{ color: "#22c55e", marginTop: "15px" }}>
                Unlimited Access 🚀
              </p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const wrapperStyle = {
  display: "flex",
  minHeight: "100vh",
  width: "100%",
  background: "#111827"
};

const sidebarStyle = {
  width: "240px",
  background: "#0f172a",
  color: "white",
  padding: "25px",
  display: "flex",
  flexDirection: "column",
  gap: "18px"
};

const menuItem = {
  cursor: "pointer",
  fontSize: "15px",
  transition: "all 0.2s ease"
};

const logoutBtn = {
  padding: "10px",
  width: "100%",
  background: "#ef4444",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600"
};

const mainStyle = {
  flex: 1,
  background: "#111827",
  color: "white",
  padding: "50px"
};

const cardContainer = {
  display: "flex",
  gap: "25px",
  flexWrap: "wrap"
};

const cardStyle = {
  background: "#1f2937",
  padding: "30px",
  borderRadius: "16px",
  width: "230px",
  boxShadow: "0 20px 40px rgba(0,0,0,0.35)"
};

const bigText = {
  fontSize: "28px",
  fontWeight: "700",
  marginTop: "10px"
};

const progressBarBg = {
  background: "#334155",
  borderRadius: "8px",
  height: "12px",
  marginTop: "15px",
  overflow: "hidden"
};

const progressBarFill = {
  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
  height: "100%",
  transition: "width 0.3s ease"
};

export default Dashboard;
