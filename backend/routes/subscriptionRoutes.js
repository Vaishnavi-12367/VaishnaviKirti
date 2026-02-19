const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Tenant = require("../models/Tenant");
const Plan = require("../models/Plan");
const User = require("../models/User");
const Activity = require("../models/Activity");

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey123");
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// Get all available plans
router.get("/plans", async (req, res) => {
  try {
    const plans = await Plan.find().sort({ price: 1 });
    res.json(plans);
  } catch (error) {
    console.error("Error fetching plans:", error);
    res.status(500).json({ message: "Error fetching plans" });
  }
});

// Get current subscription
router.get("/current/:tenantId", verifyToken, async (req, res) => {
  try {
    const { tenantId } = req.params;

    // Verify user belongs to tenant
    if (req.user.tenantId !== tenantId) {
      return res.status(403).json({ message: "Access denied" });
    }

    const tenant = await Tenant.findById(tenantId);
    const plan = await Plan.getPlanByName(tenant?.plan || "Free");

    if (!tenant) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    res.json({
      plan: tenant.plan,
      status: tenant.status,
      billingCycle: tenant.billingCycle,
      subscriptionEndDate: tenant.subscriptionEndDate,
      features: tenant.features,
      settings: tenant.settings,
      planDetails: plan
    });
  } catch (error) {
    console.error("Error fetching subscription:", error);
    res.status(500).json({ message: "Error fetching subscription" });
  }
});

// Upgrade subscription
router.post("/upgrade", verifyToken, async (req, res) => {
  try {
    const { planName, billingCycle = "Monthly" } = req.body;
    const { tenantId, email } = req.user;

    // Check if user has permission (Admin, Owner)
    if (!["Admin", "Owner"].includes(req.user.role)) {
      return res.status(403).json({ message: "Only Admin can upgrade subscription" });
    }

    // Get the plan
    const plan = await Plan.getPlanByName(planName);
    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    // Update tenant
    const tenant = await Tenant.findOne({ _id: tenantId });
    if (!tenant) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    // Update tenant settings based on plan
    tenant.plan = planName;
    tenant.billingCycle = billingCycle;
    tenant.features = plan.features;
    tenant.settings = {
      ...tenant.settings,
      maxUsers: plan.limits.maxUsers,
      maxNotes: plan.limits.maxNotes,
      maxStorage: plan.limits.maxStorage,
      enableAnalytics: plan.features.advancedAnalytics,
      enableAPI: plan.features.apiAccess
    };

    // Set subscription end date
    const endDate = new Date();
    if (billingCycle === "Monthly") {
      endDate.setMonth(endDate.getMonth() + 1);
    } else {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }
    tenant.subscriptionEndDate = endDate;
    tenant.status = "active";

    await tenant.save();

    // Update all users in the tenant
    await User.updateMany(
      { tenantId },
      { plan: planName, billingCycle }
    );

    // Log activity
    const activity = new Activity({
      tenantId,
      userEmail: email,
      action: `Upgraded to ${planName} plan (${billingCycle})`
    });
    await activity.save();

    res.json({
      message: `Successfully upgraded to ${planName} plan`,
      plan: planName,
      billingCycle,
      subscriptionEndDate: endDate
    });
  } catch (error) {
    console.error("Error upgrading subscription:", error);
    res.status(500).json({ message: "Error upgrading subscription" });
  }
});

// Cancel subscription
router.post("/cancel", verifyToken, async (req, res) => {
  try {
    const { tenantId, email } = req.user;

    // Check if user has permission (Admin, Owner)
    if (!["Admin", "Owner"].includes(req.user.role)) {
      return res.status(403).json({ message: "Only Admin can cancel subscription" });
    }

    const tenant = await Tenant.findOne({ _id: tenantId });
    if (!tenant) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    // Downgrade to Free plan
    tenant.plan = "Free";
    tenant.status = "cancelled";
    tenant.features = {
      apiAccess: false,
      advancedAnalytics: false,
      prioritySupport: false,
      customDomain: false,
      whiteLabel: false,
      auditLogs: false,
      sso: false,
      advancedSecurity: false
    };
    tenant.settings = {
      ...tenant.settings,
      maxUsers: 3,
      maxNotes: 3,
      maxStorage: 100,
      enableAnalytics: false,
      enableAPI: false
    };

    await tenant.save();

    // Update all users in the tenant
    await User.updateMany(
      { tenantId },
      { plan: "Free" }
    );

    // Log activity
    const activity = new Activity({
      tenantId,
      userEmail: email,
      action: "Cancelled subscription - downgraded to Free plan"
    });
    await activity.save();

    res.json({
      message: "Subscription cancelled successfully",
      plan: "Free"
    });
  } catch (error) {
    console.error("Error cancelling subscription:", error);
    res.status(500).json({ message: "Error cancelling subscription" });
  }
});

// Change billing cycle
router.put("/billing-cycle", verifyToken, async (req, res) => {
  try {
    const { billingCycle } = req.body;
    const { tenantId, email } = req.user;

    // Check if user has permission (Admin, Owner)
    if (!["Admin", "Owner"].includes(req.user.role)) {
      return res.status(403).json({ message: "Only Admin can change billing cycle" });
    }

    const tenant = await Tenant.findOne({ _id: tenantId });
    if (!tenant) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    tenant.billingCycle = billingCycle;
    
    // Update subscription end date
    const endDate = new Date();
    if (billingCycle === "Monthly") {
      endDate.setMonth(endDate.getMonth() + 1);
    } else {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }
    tenant.subscriptionEndDate = endDate;

    await tenant.save();

    // Update all users in the tenant
    await User.updateMany(
      { tenantId },
      { billingCycle }
    );

    // Log activity
    const activity = new Activity({
      tenantId,
      userEmail: email,
      action: `Changed billing cycle to ${billingCycle}`
    });
    await activity.save();

    res.json({
      message: `Billing cycle changed to ${billingCycle}`,
      billingCycle,
      subscriptionEndDate: endDate
    });
  } catch (error) {
    console.error("Error changing billing cycle:", error);
    res.status(500).json({ message: "Error changing billing cycle" });
  }
});

// Get billing history (placeholder for Stripe integration)
router.get("/history/:tenantId", verifyToken, async (req, res) => {
  try {
    const { tenantId } = req.params;

    // Verify user belongs to tenant
    if (req.user.tenantId !== tenantId) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Check if user has permission (Admin, Owner)
    if (!["Admin", "Owner"].includes(req.user.role)) {
      return res.status(403).json({ message: "Only Admin can view billing history" });
    }

    // Get activities related to billing
    const billingActivities = await Activity.find({
      tenantId,
      action: { $regex: /(upgraded|cancelled|billing|payment)/i }
    }).sort({ createdAt: -1 });

    // For now, return activity log as billing history
    // In production, this would integrate with Stripe
    const history = billingActivities.map(activity => ({
      id: activity._id,
      date: activity.createdAt,
      action: activity.action,
      status: "completed"
    }));

    res.json(history);
  } catch (error) {
    console.error("Error fetching billing history:", error);
    res.status(500).json({ message: "Error fetching billing history" });
  }
});

// Webhook for Stripe (placeholder)
router.post("/webhook", async (req, res) => {
  try {
    // This would handle Stripe webhooks
    // For now, just acknowledge the webhook
    const event = req.body;
    
    console.log("Received Stripe webhook:", event.type);
    
    res.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(400).json({ message: "Webhook error" });
  }
});

module.exports = router;
