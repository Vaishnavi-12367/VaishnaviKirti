import { useEffect, useState } from "react";

function Activity() {
  const tenantId = localStorage.getItem("tenantId");
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/api/auth/activity/${tenantId}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setLogs(data);
        } else {
          setLogs([]);
        }
      });
  }, [tenantId]);

  return (
    <div style={{
      minHeight: "100vh",
      padding: "60px",
      background: "#111827",
      color: "white"
    }}>
      <h1 style={{ fontSize: "36px", marginBottom: "40px" }}>
        📜 Activity Log
      </h1>

      {logs.map((log) => (
        <div key={log._id} style={{
          background: "#1f2937",
          padding: "20px",
          borderRadius: "12px",
          marginBottom: "15px"
        }}>
          <strong>{log.userEmail}</strong> — {log.action}
          <p style={{ fontSize: "14px", color: "#9ca3af" }}>
            {new Date(log.createdAt).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}

export default Activity;
