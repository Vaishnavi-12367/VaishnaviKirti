import { useState } from "react";

function Settings() {
  const email = localStorage.getItem("userEmail");
  const role = localStorage.getItem("userRole");
  const billingCycle = localStorage.getItem("billingCycle");

  const [newPassword, setNewPassword] = useState("");

  const changePassword = async () => {
    await fetch("http://localhost:5000/api/auth/change-password", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        newPassword
      })
    });

    alert("Password changed successfully 🔐");
    setNewPassword("");
  };

  return (
    <div style={{
      padding: "40px",
      minHeight: "100vh",
      background: "linear-gradient(135deg,#0f172a,#1e293b)",
      color: "white"
    }}>
      <h1 style={{ marginBottom: "30px" }}>⚙ Account Settings</h1>

      <div style={cardStyle}>
        <h3>Email</h3>
        <p>{email}</p>

        <h3>Role</h3>
        <p>{role}</p>

        <h3>Billing Cycle</h3>
        <p>{billingCycle}</p>
      </div>

      <div style={{ ...cardStyle, marginTop: "30px" }}>
        <h3>Change Password</h3>

        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          style={inputStyle}
        />

        <button onClick={changePassword} style={btnStyle}>
          Update Password
        </button>
      </div>
    </div>
  );
}

const cardStyle = {
  background: "#1f2937",
  padding: "25px",
  borderRadius: "12px",
  marginBottom: "20px"
};

const inputStyle = {
  padding: "10px",
  borderRadius: "6px",
  border: "none",
  marginTop: "10px",
  marginBottom: "15px",
  width: "100%"
};

const btnStyle = {
  padding: "10px",
  borderRadius: "6px",
  border: "none",
  background: "#6366f1",
  color: "white",
  cursor: "pointer"
};

export default Settings;
