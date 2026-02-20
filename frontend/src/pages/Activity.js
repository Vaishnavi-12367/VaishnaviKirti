import { useEffect, useState } from "react";
import { FaHistory, FaUser, FaCog, FaSignInAlt, FaStickyNote, FaUsers, FaCreditCard, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import "./Activity.css";

function Activity() {
  const tenantId = localStorage.getItem("tenantId");
  const token = localStorage.getItem("token");
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetch(`http://localhost:5000/api/auth/activity/${tenantId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setLogs(data);
        } else {
          setLogs([]);
        }
      })
      .catch(() => setLogs([]));
  }, [tenantId, token]);

  const getActivityIcon = (action) => {
    const lowerAction = action.toLowerCase();
    if (lowerAction.includes("login") || lowerAction.includes("sign")) return <FaSignInAlt />;
    if (lowerAction.includes("note") || lowerAction.includes("created") || lowerAction.includes("updated") || lowerAction.includes("delete")) return <FaStickyNote />;
    if (lowerAction.includes("team") || lowerAction.includes("member") || lowerAction.includes("invite")) return <FaUsers />;
    if (lowerAction.includes("billing") || lowerAction.includes("upgrade") || lowerAction.includes("subscription")) return <FaCreditCard />;
    if (lowerAction.includes("settings") || lowerAction.includes("update")) return <FaCog />;
    return <FaUser />;
  };

  const getActivityColor = (action) => {
    const lowerAction = action.toLowerCase();
    if (lowerAction.includes("delete") || lowerAction.includes("cancel")) return "#ef4444";
    if (lowerAction.includes("create") || lowerAction.includes("login")) return "#22c55e";
    if (lowerAction.includes("update") || lowerAction.includes("edit")) return "#3b82f6";
    if (lowerAction.includes("upgrade")) return "#8b5cf6";
    return "#6366f1";
  };

  const filteredLogs = filter === "all" 
    ? logs 
    : logs.filter(log => log.action.toLowerCase().includes(filter));

  return (
    <div className="activity-wrapper">
      <div className="activity-header">
        <div className="activity-header-left">
          <h1 className="activity-title">
            <FaHistory className="activity-title-icon" />
            Activity Log
          </h1>
          <p className="activity-subtitle">Track all activities in your workspace</p>
        </div>
        <div className="activity-header-right">
          <select 
            className="activity-filter-select"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Activities</option>
            <option value="login">Logins</option>
            <option value="note">Notes</option>
            <option value="team">Team</option>
            <option value="billing">Billing</option>
          </select>
        </div>
      </div>

      <div className="activity-stats">
        <div className="activity-stat-card">
          <span className="activity-stat-label">Total Activities</span>
          <span className="activity-stat-value">{logs.length}</span>
        </div>
        <div className="activity-stat-card">
          <span className="activity-stat-label">Today</span>
          <span className="activity-stat-value">
            {logs.filter(l => new Date(l.createdAt).toDateString() === new Date().toDateString()).length}
          </span>
        </div>
        <div className="activity-stat-card">
          <span className="activity-stat-label">This Week</span>
          <span className="activity-stat-value">
            {logs.filter(l => {
              const weekAgo = new Date();
              weekAgo.setDate(weekAgo.getDate() - 7);
              return new Date(l.createdAt) > weekAgo;
            }).length}
          </span>
        </div>
      </div>

      <div className="activity-list">
        {filteredLogs.length === 0 ? (
          <div className="activity-empty">
            <FaHistory className="activity-empty-icon" />
            <p>No activities found</p>
          </div>
        ) : (
          filteredLogs.map((log) => (
            <div key={log._id} className="activity-item">
              <div 
                className="activity-icon"
                style={{ background: `${getActivityColor(log.action)}20`, color: getActivityColor(log.action) }}
              >
                {getActivityIcon(log.action)}
              </div>
              <div className="activity-content">
                <div className="activity-user">{log.userEmail || "System"}</div>
                <div className="activity-action">{log.action}</div>
              </div>
              <div className="activity-time">
                {new Date(log.createdAt).toLocaleDateString()}
                <span className="activity-time-detail">
                  {new Date(log.createdAt).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Activity;
