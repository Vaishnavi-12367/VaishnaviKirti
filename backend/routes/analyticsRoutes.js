const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Activity = require("../models/Activity");
const Note = require("../models/Note");
const User = require("../models/User");
const Tenant = require("../models/Tenant");
const Usage = require("../models/Usage");
const HealthScore = require("../models/HealthScore");

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

// Get dashboard analytics
router.get("/dashboard/:tenantId", verifyToken, async (req, res) => {
  try {
    const { tenantId } = req.params;
    
    // Verify user belongs to tenant
    if (req.user.tenantId !== tenantId) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Get notes count
    const notes = await Note.find({ tenantId });
    const notesCount = notes.length;

    // Get team members count
    const members = await User.find({ tenantId });
    const membersCount = members.length;

    // Get recent activity
    const recentActivity = await Activity.find({ tenantId })
      .sort({ createdAt: -1 })
      .limit(10);

    // Get usage data
    const usage = await Usage.find({ tenantId, period: "monthly" });

    // Calculate totals
    const totalNotes = notesCount;
    const totalMembers = membersCount;
    const totalStorage = usage.find(u => u.metric === "storage")?.count || 0;
    const totalAPIRequests = usage.find(u => u.metric === "api_requests")?.count || 0;

    // Get health score
    const healthScore = await HealthScore.getLatestHealthScore(tenantId);

    res.json({
      totalNotes,
      totalMembers,
      totalStorage,
      totalAPIRequests,
      recentActivity,
      healthScore: healthScore || { score: 100, grade: "A" },
      plan: req.user.plan
    });
  } catch (error) {
    console.error("Dashboard analytics error:", error);
    res.status(500).json({ message: "Error fetching analytics" });
  }
});

// Get detailed analytics
router.get("/detailed/:tenantId", verifyToken, async (req, res) => {
  try {
    const { tenantId } = req.params;
    const { period = "30" } = req.query;

    // Verify user belongs to tenant
    if (req.user.tenantId !== tenantId) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Check if user has permission (Admin, Manager, Owner)
    const allowedRoles = ["Owner", "Admin", "Manager"];
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Insufficient permissions" });
    }

    // Get tenant
    const tenant = await Tenant.findById(tenantId);
    
    // Get all notes
    const notes = await Note.find({ tenantId });
    
    // Get all members
    const members = await User.find({ tenantId });
    
    // Get activity log
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));
    
    const activities = await Activity.find({
      tenantId,
      createdAt: { $gte: startDate }
    }).sort({ createdAt: -1 });

    // Get usage data
    const usage = await Usage.find({
      tenantId,
      period: "monthly"
    });

    // Calculate daily activity for the period
    const dailyActivity = {};
    activities.forEach(activity => {
      const date = activity.createdAt.toISOString().split("T")[0];
      dailyActivity[date] = (dailyActivity[date] || 0) + 1;
    });

    // Get health score
    const healthScore = await HealthScore.getLatestHealthScore(tenantId);
    
    // Calculate health score if not exists
    let finalHealthScore = healthScore;
    if (!finalHealthScore) {
      const calculatedScore = await HealthScore.calculateHealthScore(
        tenantId,
        tenant,
        usage,
        members,
        notes
      );
      const newHealthScore = new HealthScore(calculatedScore);
      await newHealthScore.save();
      finalHealthScore = newHealthScore;
    }

    // Activity by action type
    const activityByType = {};
    activities.forEach(activity => {
      activityByType[activity.action] = (activityByType[activity.action] || 0) + 1;
    });

    res.json({
      summary: {
        totalNotes: notes.length,
        totalMembers: members.length,
        totalStorage: usage.find(u => u.metric === "storage")?.count || 0,
        totalAPIRequests: usage.find(u => u.metric === "api_requests")?.count || 0,
        totalLogins: usage.find(u => u.metric === "logins")?.count || 0
      },
      healthScore: finalHealthScore,
      dailyActivity: Object.entries(dailyActivity).map(([date, count]) => ({ date, count })),
      activityByType: Object.entries(activityByType).map(([action, count]) => ({ action, count })),
      recentActivity: activities.slice(0, 20),
      period: parseInt(period),
      plan: tenant?.plan || "Free"
    });
  } catch (error) {
    console.error("Detailed analytics error:", error);
    res.status(500).json({ message: "Error fetching detailed analytics" });
  }
});

// Get usage analytics
router.get("/usage/:tenantId", verifyToken, async (req, res) => {
  try {
    const { tenantId } = req.params;

    // Verify user belongs to tenant
    if (req.user.tenantId !== tenantId) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Get tenant
    const tenant = await Tenant.findById(tenantId);
    
    // Get current usage
    const usage = await Usage.find({ tenantId, period: "monthly" });

    // Calculate usage percentages
    const limits = {
      notes: tenant?.settings?.maxNotes || 3,
      users: tenant?.settings?.maxUsers || 3,
      storage: tenant?.settings?.maxStorage || 100,
      apiRequests: tenant?.plan === "Free" ? 0 : 1000
    };

    const usageData = {
      notes: {
        current: usage.find(u => u.metric === "notes")?.count || 0,
        limit: limits.notes,
        percentage: limits.notes > 0 ? Math.min(((usage.find(u => u.metric === "notes")?.count || 0) / limits.notes) * 100, 100) : 0
      },
      users: {
        current: usage.find(u => u.metric === "users")?.count || 0,
        limit: limits.users,
        percentage: Math.min(((usage.find(u => u.metric === "users")?.count || 0) / limits.users) * 100, 100)
      },
      storage: {
        current: usage.find(u => u.metric === "storage")?.count || 0,
        limit: limits.storage,
        percentage: Math.min(((usage.find(u => u.metric === "storage")?.count || 0) / limits.storage) * 100, 100)
      },
      apiRequests: {
        current: usage.find(u => u.metric === "api_requests")?.count || 0,
        limit: limits.apiRequests,
        percentage: limits.apiRequests > 0 ? Math.min(((usage.find(u => u.metric === "api_requests")?.count || 0) / limits.apiRequests) * 100, 100) : 0
      }
    };

    res.json({
      usage: usageData,
      plan: tenant?.plan || "Free",
      billingCycle: tenant?.billingCycle || "Monthly"
    });
  } catch (error) {
    console.error("Usage analytics error:", error);
    res.status(500).json({ message: "Error fetching usage analytics" });
  }
});

// Get health score
router.get("/health/:tenantId", verifyToken, async (req, res) => {
  try {
    const { tenantId } = req.params;

    // Verify user belongs to tenant
    if (req.user.tenantId !== tenantId) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Get tenant
    const tenant = await Tenant.findById(tenantId);
    
    // Get members
    const members = await User.find({ tenantId });
    
    // Get notes
    const notes = await Note.find({ tenantId });
    
    // Get usage
    const usage = await Usage.find({ tenantId, period: "monthly" });

    // Calculate health score
    const healthScoreData = await HealthScore.calculateHealthScore(
      tenantId,
      tenant,
      usage,
      members,
      notes
    );

    // Save or update health score
    const healthScore = await HealthScore.findOne({ tenantId });
    if (healthScore) {
      healthScore.score = healthScoreData.score;
      healthScore.grade = healthScoreData.grade;
      healthScore.factors = healthScoreData.factors;
      healthScore.details = healthScoreData.details;
      healthScore.recommendations = healthScoreData.recommendations;
      healthScore.calculatedAt = new Date();
      await healthScore.save();
    } else {
      const newHealthScore = new HealthScore(healthScoreData);
      await newHealthScore.save();
    }

    res.json(healthScoreData);
  } catch (error) {
    console.error("Health score error:", error);
    res.status(500).json({ message: "Error calculating health score" });
  }
});

// Get health score history
router.get("/health/:tenantId/history", verifyToken, async (req, res) => {
  try {
    const { tenantId } = req.params;
    const { days = 30 } = req.query;

    // Verify user belongs to tenant
    if (req.user.tenantId !== tenantId) {
      return res.status(403).json({ message: "Access denied" });
    }

    const history = await HealthScore.getHealthScoreHistory(tenantId, parseInt(days));

    res.json(history);
  } catch (error) {
    console.error("Health score history error:", error);
    res.status(500).json({ message: "Error fetching health score history" });
  }
});

// Record activity
router.post("/activity", verifyToken, async (req, res) => {
  try {
    const { action, details } = req.body;
    const { tenantId, email } = req.user;

    const activity = new Activity({
      tenantId,
      userEmail: email,
      action,
      details
    });

    await activity.save();

    // Update usage
    await Usage.incrementUsage(tenantId, "logins", 1, "monthly");

    res.json({ message: "Activity recorded", activity });
  } catch (error) {
    console.error("Activity recording error:", error);
    res.status(500).json({ message: "Error recording activity" });
  }
});

module.exports = router;
