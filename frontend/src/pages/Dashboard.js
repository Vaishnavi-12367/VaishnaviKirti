import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaStickyNote, FaUsers, FaCreditCard, FaChartLine, FaCog, FaSignOutAlt, FaBell, FaArrowUp, FaCheck, FaTimes } from "react-icons/fa";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const tenantId = localStorage.getItem("tenantId");
  const userEmail = localStorage.getItem("userEmail");
  const plan = localStorage.getItem("userPlan") || "Free";
  const role = localStorage.getItem("userRole");
  const billingCycle = localStorage.getItem("billingCycle") || "Monthly";

  const [noteCount, setNoteCount] = useState(0);
  const [memberCount, setMemberCount] = useState(0);
  const [healthScore, setHealthScore] = useState(85);

  useEffect(() => {
    // Only fetch notes if we have a tenantId
    // ProtectedRoute already validated auth, so we just fetch data
    if (!tenantId) return;

    const token = localStorage.getItem("token");
    if (!token) return; // Don't redirect, let ProtectedRoute handle it

    fetch("http://localhost:5000/api/notes", {
      headers: {
        Authorization: `Bearer ${token}`
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

  useEffect(() => {
    let score = 100;
    
    if (plan === "Free" && noteCount >= 2) {
      score -= 15;
    }
    
    if (memberCount > 1) {
      score += 5;
    }
    
    score = Math.min(100, Math.max(0, score));
    setHealthScore(score);
  }, [noteCount, memberCount, plan]);

  const getHealthColor = (score) => {
    if (score >= 80) return "excellent";
    if (score >= 60) return "good";
    return "poor";
  };

  const getHealthGrade = (score) => {
    if (score >= 90) return "A";
    if (score >= 80) return "B";
    if (score >= 70) return "C";
    if (score >= 60) return "D";
    return "F";
  };

  const getPlanLimit = () => {
    switch(plan) {
      case "Free": return 3;
      case "Starter": return 100;
      default: return -1;
    }
  };

  const limit = getPlanLimit();
  const usagePercent = limit > 0 ? Math.min((noteCount / limit) * 100, 100) : 0;
  const healthColorClass = getHealthColor(healthScore);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="dashboard-wrapper">
      {/* SIDEBAR */}
      <aside className="dashboard-sidebar">
        <div className="dashboard-logo-container">
          <span className="dashboard-logo-icon">🚀</span>
          <h2 className="dashboard-logo-text">SaaSify</h2>
        </div>

        <div className="dashboard-user-info">
          <div className="dashboard-user-avatar">{userEmail?.charAt(0).toUpperCase()}</div>
          <div className="dashboard-user-details">
            <p className="dashboard-user-email">{userEmail}</p>
            <span className="dashboard-user-role">{role}</span>
          </div>
        </div>

        <nav className="dashboard-nav">
          <div className="dashboard-menu-item active" onClick={() => navigate("/dashboard")}>
            <span className="dashboard-menu-icon"><FaChartLine /></span>
            <span>Dashboard</span>
          </div>
          <div className="dashboard-menu-item" onClick={() => navigate("/notes")}>
            <span className="dashboard-menu-icon"><FaStickyNote /></span>
            <span>Notes</span>
          </div>
          <div className="dashboard-menu-item" onClick={() => navigate("/subscription")}>
            <span className="dashboard-menu-icon"><FaCreditCard /></span>
            <span>Plans</span>
          </div>
          <div className="dashboard-menu-item" onClick={() => navigate("/billing")}>
            <span className="dashboard-menu-icon"><FaCreditCard /></span>
            <span>Billing</span>
          </div>
          <div className="dashboard-menu-item" onClick={() => navigate("/analytics")}>
            <span className="dashboard-menu-icon"><FaChartLine /></span>
            <span>Analytics</span>
          </div>
          <div className="dashboard-menu-item" onClick={() => navigate("/team")}>
            <span className="dashboard-menu-icon"><FaUsers /></span>
            <span>Team</span>
          </div>
          <div className="dashboard-menu-item" onClick={() => navigate("/settings")}>
            <span className="dashboard-menu-icon"><FaCog /></span>
            <span>Settings</span>
          </div>
        </nav>

        <div className="dashboard-logout-container">
          <button className="dashboard-logout-btn" onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <h1 className="dashboard-page-title">Dashboard</h1>
            <p className="dashboard-breadcrumb">Welcome back, here's your overview</p>
          </div>
          <div className="dashboard-header-right">
            <button className="dashboard-notification-btn">
              <FaBell />
            </button>
          </div>
        </header>

        <div className="dashboard-content">
          {/* Welcome Section */}
          <div className="dashboard-welcome">
            <div>
              <h2 className="dashboard-welcome-title">Welcome back! 👋</h2>
              <p className="dashboard-welcome-subtitle">{userEmail}</p>
            </div>
            <div className="dashboard-plan-badge">
              <span className="dashboard-plan-badge-text">{plan} Plan</span>
              <span className="dashboard-plan-badge-cycle">{billingCycle}</span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="dashboard-stats-grid">
            {/* Health Score Card */}
            <div className="dashboard-stat-card">
              <div className="dashboard-stat-card-header">
                <span className="dashboard-stat-card-label">Health Score</span>
                <span className={`dashboard-health-badge ${healthColorClass}`}>
                  {getHealthGrade(healthScore)}
                </span>
              </div>
              <div className="dashboard-health-score-container">
                <div className="dashboard-health-score-circle">
                  <span className={`dashboard-health-score-number ${healthColorClass}`}>{healthScore}</span>
                  <span className="dashboard-health-score-label">/ 100</span>
                </div>
              </div>
              <div className="dashboard-health-factors">
                <div className="dashboard-health-factor">
                  {noteCount > 0 ? <FaCheck className="dashboard-check-icon" /> : <FaTimes className="dashboard-times-icon" />}
                  <span>Active Usage</span>
                </div>
                <div className="dashboard-health-factor">
                  {memberCount > 1 ? <FaCheck className="dashboard-check-icon" /> : <FaTimes className="dashboard-times-icon" />}
                  <span>Team Collaboration</span>
                </div>
                <div className="dashboard-health-factor">
                  <FaCheck className="dashboard-check-icon" />
                  <span>Account Active</span>
                </div>
              </div>
            </div>

            {/* Plan Card */}
            <div className="dashboard-stat-card">
              <div className="dashboard-stat-card-header">
                <span className="dashboard-stat-card-label">Current Plan</span>
              </div>
              <div className="dashboard-plan-info">
                <h3 className="dashboard-plan-name">{plan}</h3>
                <p className="dashboard-plan-desc">
                  {plan === "Free" && "Perfect for getting started"}
                  {plan === "Starter" && "For small teams"}
                  {plan === "Pro" && "For growing businesses"}
                  {plan === "Enterprise" && "For large organizations"}
                </p>
                <div className="dashboard-plan-features">
                  <div className="dashboard-plan-feature"><FaCheck className="dashboard-check-icon" /> Unlimited Notes</div>
                  <div className="dashboard-plan-feature"><FaCheck className="dashboard-check-icon" /> Team Collaboration</div>
                  {plan !== "Free" && <div className="dashboard-plan-feature"><FaCheck className="dashboard-check-icon" /> Priority Support</div>}
                </div>
                {plan === "Free" && (
                  <button className="dashboard-upgrade-btn" onClick={() => navigate("/subscription")}>
                    Upgrade Now <FaArrowUp />
                  </button>
                )}
              </div>
            </div>

            {/* Notes Card */}
            <div className="dashboard-stat-card">
              <div className="dashboard-stat-card-header">
                <span className="dashboard-stat-card-label">Total Notes</span>
                <span className="dashboard-stat-icon"><FaStickyNote /></span>
              </div>
              <div className="dashboard-stat-value">{noteCount}</div>
              <div className="dashboard-usage-container">
                <div className="dashboard-usage-header">
                  <span className="dashboard-usage-label">Usage</span>
                  <span className="dashboard-usage-value">{limit > 0 ? `${noteCount} / ${limit}` : "Unlimited"}</span>
                </div>
                <div className="dashboard-progress-bar-bg">
                  <div className={`dashboard-progress-bar-fill ${usagePercent > 80 ? 'danger' : usagePercent > 60 ? 'warning' : 'normal'}`} style={{ width: limit > 0 ? `${usagePercent}%` : "100%" }} />
                </div>
              </div>
            </div>

            {/* Members Card - Admin Only */}
            {role === "Admin" && (
              <div className="dashboard-stat-card">
                <div className="dashboard-stat-card-header">
                  <span className="dashboard-stat-card-label">Team Members</span>
                  <span className="dashboard-stat-icon"><FaUsers /></span>
                </div>
                <div className="dashboard-stat-value">{memberCount}</div>
                <p className="dashboard-member-desc">
                  {memberCount === 1 ? "You're the only member" : `${memberCount - 1} team member${memberCount > 2 ? 's' : ''}`}
                </p>
                <button className="dashboard-manage-btn" onClick={() => navigate("/team")}>
                  Manage Team
                </button>
              </div>
            )}

            {/* Quick Actions */}
            <div className="dashboard-quick-actions-card">
              <h3 className="dashboard-quick-actions-title">Quick Actions</h3>
              <div className="dashboard-quick-actions">
                <button className="dashboard-action-btn" onClick={() => navigate("/notes")}>
                  <FaStickyNote /> New Note
                </button>
                <button className="dashboard-action-btn" onClick={() => navigate("/invite")}>
                  <FaUsers /> Invite Member
                </button>
                <button className="dashboard-action-btn" onClick={() => navigate("/subscription")}>
                  <FaCreditCard /> Upgrade Plan
                </button>
                <button className="dashboard-action-btn" onClick={() => navigate("/analytics")}>
                  <FaChartLine /> View Analytics
                </button>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
