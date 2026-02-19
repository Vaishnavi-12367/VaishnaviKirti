import { useEffect, useState } from "react";

function Team() {
  const tenantId = localStorage.getItem("tenantId");
  const role = localStorage.getItem("userRole");

  const [members, setMembers] = useState([]);

  useEffect(() => {
    if (!tenantId || role !== "Admin") return;

    fetch(`http://localhost:5000/api/auth/team/${tenantId}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setMembers(data);
        } else {
          setMembers([]);
        }
      })
      .catch(() => setMembers([]));
  }, [tenantId, role]);

  if (role !== "Admin") {
    return (
      <div style={pageStyle}>
        <h1 style={titleStyle}>👥 Team Management</h1>
        <p style={{ fontSize: "20px", color: "#f87171" }}>
          Only Admin can view and manage team members.
        </p>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <h1 style={titleStyle}>👥 Team Management</h1>

        <p style={subtitleStyle}>
          Manage your workspace members and access.
        </p>

        <div style={gridStyle}>
          {members.length === 0 && (
            <p style={{ fontSize: "20px", color: "#94a3b8" }}>
              No team members yet.
            </p>
          )}

          {members.map((member) => (
            <div key={member._id} style={cardStyle}>
              <h2 style={nameStyle}>{member.name}</h2>

              <p style={emailStyle}>{member.email}</p>

              <div style={{ marginBottom: "20px" }}>
                <span
                  style={{
                    ...badgeStyle,
                    background:
                      member.role === "Admin"
                        ? "linear-gradient(135deg, #6366f1, #8b5cf6)"
                        : "#334155"
                  }}
                >
                  {member.role}
                </span>
              </div>

              {member.role === "Member" && (
                <button
                  onClick={async () => {
                    await fetch(
                      `http://localhost:5000/api/auth/remove-member/${member._id}`,
                      { method: "DELETE" }
                    );
                    window.location.reload();
                  }}
                  style={removeBtnStyle}
                >
                  Remove Member
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const pageStyle = {
  minHeight: "100vh",
  padding: "80px 60px",
  background: "linear-gradient(135deg, #0f172a, #1e293b)",
  color: "white"
};

const titleStyle = {
  fontSize: "42px",
  fontWeight: "700",
  marginBottom: "15px"
};

const subtitleStyle = {
  fontSize: "20px",
  color: "#94a3b8",
  marginBottom: "50px"
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
  gap: "30px"
};

const cardStyle = {
  background: "#1f2937",
  padding: "35px",
  borderRadius: "18px",
  boxShadow: "0 25px 50px rgba(0,0,0,0.35)"
};

const nameStyle = {
  fontSize: "26px",
  marginBottom: "12px"
};

const emailStyle = {
  fontSize: "18px",
  color: "#9ca3af",
  marginBottom: "15px"
};

const badgeStyle = {
  padding: "8px 18px",
  borderRadius: "30px",
  fontSize: "16px",
  fontWeight: "600"
};

const removeBtnStyle = {
  padding: "10px 16px",
  background: "linear-gradient(135deg, #dc2626, #b91c1c)",
  border: "none",
  borderRadius: "10px",
  color: "white",
  fontSize: "15px",
  fontWeight: "600",
  cursor: "pointer"
};

export default Team;
