import { useState } from "react";

function Dashboard() {
  return (
    <div style={containerStyle}>
      <div style={sidebarStyle}>
        <h2 style={{ color: "white" }}>🚀 SaaSify</h2>
        <p style={menuItem}>🏠 Dashboard</p>
        <p style={menuItem}>📝 Notes</p>
        <p style={menuItem}>💳 Subscription</p>
        <p style={menuItem}>📊 Analytics</p>
      </div>

      <div style={mainStyle}>
        <div style={headerStyle}>
          <h3>Welcome Back 👋</h3>
        </div>

        <div style={contentStyle}>
          <h2>Your Workspace</h2>
          <p>This is where your SaaS content will appear.</p>
        </div>
      </div>
    </div>
  );
}
const containerStyle = {
  display: "flex",
  height: "100vh",
  width: "100%"
};

const sidebarStyle = {
  width: "220px",
  background: "#1e293b",
  padding: "20px",
  display: "flex",
  flexDirection: "column",
  gap: "20px"
};

const menuItem = {
  color: "#cbd5e1",
  cursor: "pointer"
};

const mainStyle = {
  flex: 1,
  background: "#f1f5f9",
  display: "flex",
  flexDirection: "column"
};

const headerStyle = {
  background: "white",
  padding: "20px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
};

const contentStyle = {
  padding: "30px"
};
export default Dashboard;
