import { useState } from "react";

function Invite() {
  const tenantId = localStorage.getItem("tenantId");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const inviteMember = async () => {
    await fetch("http://localhost:5000/api/auth/invite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        password,
        tenantId,
        role: localStorage.getItem("userRole")
      })
    });

    alert("Member invited 🎉");

    setName("");
    setEmail("");
    setPassword("");
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>👥 Invite Team Member</h1>
        <p style={subtitleStyle}>
          Add members to collaborate inside your workspace.
        </p>

        <input
          style={inputStyle}
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          style={inputStyle}
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          style={inputStyle}
          type="password"
          placeholder="Temporary Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button style={buttonStyle} onClick={inviteMember}>
          Invite Member 🚀
        </button>
      </div>
    </div>
  );
}

/* -------- STYLES -------- */

const pageStyle = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "linear-gradient(135deg, #0f172a, #1e293b)",
  padding: "40px"
};

const cardStyle = {
  background: "rgba(31, 41, 55, 0.9)",
  backdropFilter: "blur(10px)",
  padding: "50px",
  borderRadius: "20px",
  width: "100%",
  maxWidth: "500px",
  boxShadow: "0 30px 60px rgba(0,0,0,0.4)",
  display: "flex",
  flexDirection: "column",
  gap: "20px"
};

const titleStyle = {
  fontSize: "32px",
  marginBottom: "10px"
};

const subtitleStyle = {
  fontSize: "16px",
  color: "#94a3b8",
  marginBottom: "20px"
};

const inputStyle = {
  padding: "14px",
  borderRadius: "10px",
  border: "1px solid #334155",
  background: "#111827",
  color: "white",
  fontSize: "15px",
  outline: "none"
};

const buttonStyle = {
  marginTop: "10px",
  padding: "14px",
  borderRadius: "12px",
  border: "none",
  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
  color: "white",
  fontSize: "16px",
  fontWeight: "600",
  cursor: "pointer",
  boxShadow: "0 10px 25px rgba(99,102,241,0.4)",
  transition: "all 0.3s ease"
};

export default Invite;
