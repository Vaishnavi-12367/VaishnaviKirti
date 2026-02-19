import { useState } from "react";
import { FaCheck, FaTimes, FaCrown, FaRocket, FaBuilding, FaStar } from "react-icons/fa";

function Subscription() {
  const email = localStorage.getItem("userEmail");
  const plan = localStorage.getItem("userPlan") || "Free";
  const billingCycle = localStorage.getItem("billingCycle") || "Monthly";
 
  const [selectedCycle, setSelectedCycle] = useState(billingCycle);

  const plans = [
    {
      name: "Free",
      price: { monthly: 0, yearly: 0 },
      icon: <FaStar />,
      color: "#64748b",
      features: [
        { name: "3 Notes", included: true },
        { name: "3 Team Members", included: true },
        { name: "Basic Support", included: true },
        { name: "Analytics", included: false },
        { name: "API Access", included: false },
        { name: "Priority Support", included: false },
      ]
    },
    {
      name: "Starter",
      price: { monthly: 9, yearly: 90 },
      icon: <FaRocket />,
      color: "#3b82f6",
      popular: false,
      features: [
        { name: "100 Notes", included: true },
        { name: "10 Team Members", included: true },
        { name: "Email Support", included: true },
        { name: "Basic Analytics", included: true },
        { name: "API Access", included: true },
        { name: "Priority Support", included: false },
      ]
    },
    {
      name: "Pro",
      price: { monthly: 29, yearly: 290 },
      icon: <FaCrown />,
      color: "#8b5cf6",
      popular: true,
      features: [
        { name: "Unlimited Notes", included: true },
        { name: "50 Team Members", included: true },
        { name: "Priority Support", included: true },
        { name: "Advanced Analytics", included: true },
        { name: "API Access", included: true },
        { name: "Custom Branding", included: false },
      ]
    },
    {
      name: "Enterprise",
      price: { monthly: 99, yearly: 990 },
      icon: <FaBuilding />,
      color: "#f59e0b",
      popular: false,
      features: [
        { name: "Unlimited Everything", included: true },
        { name: "Unlimited Members", included: true },
        { name: "24/7 Dedicated Support", included: true },
        { name: "Advanced Analytics", included: true },
        { name: "Full API Access", included: true },
        { name: "Custom Branding & SSO", included: true },
      ]
    }
  ];

  const handleUpgrade = async (planName) => {
    try {
      await fetch("http://localhost:5000/api/auth/upgrade", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, plan: planName })
      });

      localStorage.setItem("userPlan", planName);
      alert(`Upgraded to ${planName} plan! 🚀`);
      window.location.reload();
    } catch (err) {
      alert("Upgrade failed. Please try again.");
    }
  };

  const currentPrice = (planObj) => {
    return selectedCycle === "Monthly" ? planObj.price.monthly : planObj.price.yearly;
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerSection}>
        <h1 style={title}>Choose Your Plan</h1>
        <p style={subtitle}>Select the perfect plan for your team's needs</p>
        
        {/* Billing Toggle */}
        <div style={toggleContainer}>
          <button 
            style={selectedCycle === "Monthly" ? toggleBtnActive : toggleBtn}
            onClick={() => setSelectedCycle("Monthly")}
          >
            Monthly
          </button>
          <button 
            style={selectedCycle === "Yearly" ? toggleBtnActive : toggleBtn}
            onClick={() => setSelectedCycle("Yearly")}
          >
            Yearly
            <span style={saveBadge}>Save 20%</span>
          </button>
        </div>
      </div>

      {/* Current Plan Banner */}
      <div style={currentPlanBanner}>
        <span>Current Plan: </span>
        <span style={currentPlanName}>{plan}</span>
      </div>

      {/* Plans Grid */}
      <div style={plansGrid}>
        {plans.map((planObj) => (
          <div 
            key={planObj.name}
            style={{
              ...planCard,
              border: planObj.popular ? `2px solid ${planObj.color}` : "1px solid #334155",
              transform: planObj.popular ? "scale(1.05)" : "scale(1)",
            }}
          >
            {planObj.popular && (
              <div style={popularBadge}>Most Popular</div>
            )}
            
            <div style={planIconContainer}>
              <div style={{...planIcon, background: `${planObj.color}20`, color: planObj.color}}>
                {planObj.icon}
              </div>
            </div>
            
            <h3 style={planName}>{planObj.name}</h3>
            
            <div style={priceContainer}>
              <span style={currency}>$</span>
              <span style={price}>{currentPrice(planObj)}</span>
              <span style={period}>/{selectedCycle === "Monthly" ? "mo" : "yr"}</span>
            </div>

            <ul style={featuresList}>
              {planObj.features.map((feature, index) => (
                <li key={index} style={featureItem}>
                  {feature.included ? (
                    <FaCheck style={checkIcon} />
                  ) : (
                    <FaTimes style={timesIcon} />
                  )}
                  <span style={feature.included ? featureText : featureTextDisabled}>
                    {feature.name}
                  </span>
                </li>
              ))}
            </ul>

            {plan === planObj.name ? (
              <button style={currentPlanBtn}>
                Current Plan
              </button>
            ) : (
              <button 
                style={{
                  ...upgradeBtn,
                  background: planObj.popular 
                    ? `linear-gradient(135deg, ${planObj.color}, ${planObj.color}dd)` 
                    : "#334155"
                }}
                onClick={() => handleUpgrade(planObj.name)}
              >
                {planObj.price.monthly === 0 ? "Get Started" : "Upgrade Now"}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* FAQ Section */}
      <div style={faqSection}>
        <h2 style={faqTitle}>Frequently Asked Questions</h2>
        <div style={faqGrid}>
          <div style={faqItem}>
            <h4 style={faqQuestion}>Can I change plans anytime?</h4>
            <p style={faqAnswer}>Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
          </div>
          <div style={faqItem}>
            <h4 style={faqQuestion}>What payment methods do you accept?</h4>
            <p style={faqAnswer}>We accept all major credit cards, debit cards, and PayPal.</p>
          </div>
          <div style={faqItem}>
            <h4 style={faqQuestion}>Is there a free trial?</h4>
            <p style={faqAnswer}>Our Free plan lets you try our basic features. Upgrade to Pro for a 14-day money-back guarantee.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const containerStyle = {
  minHeight: "100vh",
  padding: "40px",
  background: "#0f172a",
  color: "white",
};

const headerSection = {
  textAlign: "center",
  marginBottom: "40px"
};

const title = {
  fontSize: "40px",
  fontWeight: "700",
  marginBottom: "12px",
  background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent"
};

const subtitle = {
  fontSize: "18px",
  color: "#94a3b8",
  marginBottom: "32px"
};

const toggleContainer = {
  display: "inline-flex",
  gap: "8px",
  background: "#1e293b",
  padding: "6px",
  borderRadius: "12px"
};

const toggleBtn = {
  padding: "12px 24px",
  borderRadius: "8px",
  border: "none",
  background: "transparent",
  color: "#94a3b8",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: "600",
  display: "flex",
  alignItems: "center",
  gap: "8px"
};

const toggleBtnActive = {
  padding: "12px 24px",
  borderRadius: "8px",
  border: "none",
  background: "#6366f1",
  color: "white",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: "600",
  display: "flex",
  alignItems: "center",
  gap: "8px"
};

const saveBadge = {
  background: "#22c55e",
  color: "white",
  padding: "2px 8px",
  borderRadius: "4px",
  fontSize: "11px",
  fontWeight: "700"
};

const currentPlanBanner = {
  background: "linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1))",
  border: "1px solid rgba(99, 102, 241, 0.3)",
  padding: "16px 24px",
  borderRadius: "12px",
  textAlign: "center",
  marginBottom: "40px",
  fontSize: "16px",
  color: "#94a3b8"
};

const currentPlanName = {
  color: "#22c55e",
  fontWeight: "700",
  marginLeft: "8px"
};

const plansGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  gap: "24px",
  maxWidth: "1200px",
  margin: "0 auto"
};

const planCard = {
  background: "#1e293b",
  borderRadius: "20px",
  padding: "32px",
  position: "relative",
  transition: "all 0.3s ease"
};

const popularBadge = {
  position: "absolute",
  top: "-12px",
  left: "50%",
  transform: "translateX(-50%)",
  background: "linear-gradient(135deg, #8b5cf6, #a855f7)",
  color: "white",
  padding: "6px 16px",
  borderRadius: "20px",
  fontSize: "12px",
  fontWeight: "700",
  textTransform: "uppercase",
  letterSpacing: "0.5px"
};

const planIconContainer = {
  display: "flex",
  justifyContent: "center",
  marginBottom: "20px"
};

const planIcon = {
  width: "60px",
  height: "60px",
  borderRadius: "16px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "24px"
};

const planName = {
  fontSize: "24px",
  fontWeight: "700",
  textAlign: "center",
  marginBottom: "16px"
};

const priceContainer = {
  display: "flex",
  alignItems: "baseline",
  justifyContent: "center",
  marginBottom: "24px"
};

const currency = {
  fontSize: "24px",
  fontWeight: "600",
  color: "#94a3b8"
};

const price = {
  fontSize: "48px",
  fontWeight: "800"
};

const period = {
  fontSize: "16px",
  color: "#64748b",
  marginLeft: "4px"
};

const featuresList = {
  listStyle: "none",
  padding: 0,
  margin: "0 0 24px 0"
};

const featureItem = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  padding: "8px 0",
  fontSize: "14px"
};

const checkIcon = {
  color: "#22c55e",
  fontSize: "14px"
};

const timesIcon = {
  color: "#475569",
  fontSize: "14px"
};

const featureText = {
  color: "#cbd5e1"
};

const featureTextDisabled = {
  color: "#475569",
  textDecoration: "line-through"
};

const upgradeBtn = {
  width: "100%",
  padding: "14px",
  borderRadius: "12px",
  border: "none",
  color: "white",
  fontSize: "16px",
  fontWeight: "600",
  cursor: "pointer",
  transition: "all 0.2s ease",
};

const currentPlanBtn = {
  width: "100%",
  padding: "14px",
  borderRadius: "12px",
  border: "1px solid #22c55e",
  background: "rgba(34, 197, 94, 0.1)",
  color: "#22c55e",
  fontSize: "16px",
  fontWeight: "600",
  cursor: "default"
};

const faqSection = {
  marginTop: "80px",
  maxWidth: "800px",
  margin: "80px auto 0"
};

const faqTitle = {
  fontSize: "28px",
  fontWeight: "700",
  textAlign: "center",
  marginBottom: "40px"
};

const faqGrid = {
  display: "grid",
  gap: "24px",
};

const faqItem = {
  background: "#1e293b",
  padding: "24px",
  borderRadius: "16px",
  border: "1px solid #334155"
};

const faqQuestion = {
  fontSize: "16px",
  fontWeight: "600",
  marginBottom: "8px",
  color: "#f8fafc"
};

const faqAnswer = {
  fontSize: "14px",
  color: "#94a3b8",
  lineHeight: "1.6",
};

export default Subscription;
