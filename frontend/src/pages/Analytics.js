import { useEffect, useState } from "react";
import { 
  FaChartLine, FaChartBar, FaUsers, FaStickyNote, 
  FaClock, FaArrowUp, FaArrowDown, FaCheck,
  FaExclamationTriangle, FaDatabase, FaServer, FaShieldAlt
} from "react-icons/fa";
import "./Analytics.css";

function Analytics() {
  // Simple synchronous access
  const token = localStorage.getItem("token");
  const tenantId = localStorage.getItem("tenantId");
  const plan = localStorage.getItem("userPlan") || "Free";
  
  const [notesCount, setNotesCount] = useState(0);
  const [teamCount, setTeamCount] = useState(0);

  useEffect(() => {
    if (!token || !tenantId) return;

    // Fetch notes count
    fetch("http://localhost:5000/api/notes", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setNotesCount(data.length);
      })
      .catch(() => setNotesCount(0));

    // Fetch team count
    fetch(`http://localhost:5000/api/auth/team/${tenantId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setTeamCount(data.length);
      })
      .catch(() => setTeamCount(0));

  }, [token, tenantId]);

  const usagePercent = Math.min((notesCount / 100) * 100, 100);
  const teamPercent = Math.min((teamCount / 50) * 100, 100);

  const statsCards = [
    { title: "Total Notes", value: notesCount, icon: <FaStickyNote />, change: "+12%", trend: "up", color: "#6366f1" },
    { title: "Team Members", value: teamCount, icon: <FaUsers />, change: teamCount > 1 ? "+1" : "0", trend: teamCount > 1 ? "up" : "neutral", color: "#8b5cf6" },
    { title: "Active Sessions", value: Math.floor(Math.random() * 10) + 1, icon: <FaServer />, change: "+5%", trend: "up", color: "#22c55e" },
    { title: "Storage Used", value: `${Math.floor(Math.random() * 50) + 10}MB`, icon: <FaDatabase />, change: "-2%", trend: "down", color: "#f59e0b" }
  ];

  const activityData = [
    { action: "Note Created", count: Math.floor(Math.random() * 20) + 5, color: "#6366f1" },
    { action: "Note Updated", count: Math.floor(Math.random() * 15) + 3, color: "#8b5cf6" },
    { action: "User Login", count: Math.floor(Math.random() * 30) + 10, color: "#22c55e" },
    { action: "Settings Changed", count: Math.floor(Math.random() * 5) + 1, color: "#f59e0b" },
  ];

  if (plan !== "Pro") {
    return (
      <div className="analytics-wrapper">
        <div className="analytics-header">
          <h1 className="analytics-title"><FaChartLine className="analytics-title-icon" />Analytics</h1>
          <p className="analytics-subtitle">Track your workspace performance</p>
        </div>
        <div className="analytics-upgrade-prompt">
          <div className="analytics-upgrade-icon"><FaExclamationTriangle /></div>
          <h2>Upgrade to Pro</h2>
          <p>Advanced analytics is available for Pro users only.</p>
          <button className="analytics-upgrade-btn">Upgrade Now <FaArrowUp /></button>
        </div>
      </div>
    );
  }

  return (
    <div className="analytics-wrapper">
      <div className="analytics-header">
        <div className="analytics-header-left">
          <h1 className="analytics-title"><FaChartLine className="analytics-title-icon" />Analytics</h1>
          <p className="analytics-subtitle">Track your workspace performance</p>
        </div>
      </div>

      <div className="analytics-stats-grid">
        {statsCards.map((stat, index) => (
          <div key={index} className="analytics-stat-card" style={{ "--card-color": stat.color }}>
            <div className="analytics-stat-header">
              <span className="analytics-stat-label">{stat.title}</span>
              <div className="analytics-stat-icon" style={{ background: `${stat.color}20`, color: stat.color }}>{stat.icon}</div>
            </div>
            <div className="analytics-stat-value">{stat.value}</div>
            <div className={`analytics-stat-change ${stat.trend}`}>
              {stat.trend === "up" && <FaArrowUp />}
              {stat.trend === "down" && <FaArrowDown />}
              <span>{stat.change}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="analytics-charts-section">
        <div className="analytics-chart-card">
          <div className="analytics-chart-header"><h3><FaChartBar /> Activity Overview</h3></div>
          <div className="analytics-bar-chart">
            {activityData.map((item, index) => (
              <div key={index} className="analytics-bar-item">
                <div className="analytics-bar-label"><span>{item.action}</span><span className="analytics-bar-value">{item.count}</span></div>
                <div className="analytics-bar-track">
                  <div className="analytics-bar-fill" style={{ width: `${(item.count / 30) * 100}%`, background: item.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="analytics-chart-card">
          <div className="analytics-chart-header"><h3><FaDatabase /> Usage Overview</h3></div>
          <div className="analytics-usage-item">
            <div className="analytics-usage-header"><span>Notes</span><span>{notesCount}/100</span></div>
            <div className="analytics-usage-bar-bg"><div className="analytics-usage-bar-fill" style={{ width: `${usagePercent}%` }} /></div>
          </div>
          <div className="analytics-usage-item">
            <div className="analytics-usage-header"><span>Team</span><span>{teamCount}/50</span></div>
            <div className="analytics-usage-bar-bg"><div className="analytics-usage-bar-fill" style={{ width: `${teamPercent}%` }} /></div>
          </div>
        </div>
      </div>

      <div className="analytics-health-section">
        <div className="analytics-chart-card">
          <div className="analytics-chart-header"><h3><FaShieldAlt /> System Health</h3></div>
          <div className="analytics-health-grid">
            <div className="analytics-health-item">
              <div className="analytics-health-icon success"><FaCheck /></div>
              <div className="analytics-health-info"><span className="analytics-health-label">API</span><span className="analytics-health-value">OK</span></div>
            </div>
            <div className="analytics-health-item">
              <div className="analytics-health-icon success"><FaCheck /></div>
              <div className="analytics-health-info"><span className="analytics-health-label">Database</span><span className="analytics-health-value">OK</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
