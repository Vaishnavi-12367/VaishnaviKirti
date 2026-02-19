const mongoose = require("mongoose");

const healthScoreSchema = new mongoose.Schema({
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tenant",
    required: true
  },
  score: {
    type: Number,
    default: 100,
    min: 0,
    max: 100
  },
  grade: {
    type: String,
    enum: ["A", "B", "C", "D", "F"],
    default: "A"
  },
  factors: {
    usageScore: { type: Number, default: 100 },
    teamScore: { type: Number, default: 100 },
    subscriptionScore: { type: Number, default: 100 },
    activityScore: { type: Number, default: 100 },
    securityScore: { type: Number, default: 100 }
  },
  details: {
    activeUsers: { type: Number, default: 0 },
    totalNotes: { type: Number, default: 0 },
    storageUsed: { type: Number, default: 0 },
    storageLimit: { type: Number, default: 100 },
    lastActivity: { type: Date, default: null },
    daysSinceLastActivity: { type: Number, default: 0 },
    planStatus: { type: String, default: "active" },
    paymentStatus: { type: String, default: "current" }
  },
  recommendations: [{
    type: String
  }],
  calculatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Compound index for efficient queries
healthScoreSchema.index({ tenantId: 1, calculatedAt: -1 });

// Static method to calculate health score
healthScoreSchema.statics.calculateHealthScore = async function(tenantId, tenant, usage, members, notes) {
  let score = 100;
  const factors = {
    usageScore: 100,
    teamScore: 100,
    subscriptionScore: 100,
    activityScore: 100,
    securityScore: 100
  };
  
  const details = {
    activeUsers: members?.length || 0,
    totalNotes: notes?.length || 0,
    storageUsed: 0,
    storageLimit: tenant?.settings?.maxStorage || 100,
    lastActivity: null,
    daysSinceLastActivity: 0,
    planStatus: tenant?.status || "active",
    paymentStatus: "current"
  };
  
  const recommendations = [];
  
  // Calculate usage score (based on notes limit)
  const noteLimit = tenant?.settings?.maxNotes || 3;
  const noteUsagePercent = noteLimit > 0 ? (notes?.length || 0) / noteLimit : 0;
  
  if (noteUsagePercent >= 0.9) {
    factors.usageScore = 30;
    score -= 20;
    recommendations.push("You're nearing your note limit. Consider upgrading your plan.");
  } else if (noteUsagePercent >= 0.7) {
    factors.usageScore = 60;
    score -= 10;
  }
  
  // Calculate team score
  const maxUsers = tenant?.settings?.maxUsers || 3;
  const userUsagePercent = (members?.length || 0) / maxUsers;
  
  if (userUsagePercent >= 0.9) {
    factors.teamScore = 40;
    score -= 15;
    recommendations.push("You're at your team member limit. Consider upgrading for more seats.");
  } else if (userUsagePercent >= 0.7) {
    factors.teamScore = 70;
    score -= 5;
  }
  
  // Calculate subscription score
  if (tenant?.plan === "Free") {
    factors.subscriptionScore = 60;
    score -= 15;
    recommendations.push("Upgrade to a paid plan to unlock more features.");
  }
  
  // Calculate activity score (based on recency)
  const daysSinceLastActivity = details.daysSinceLastActivity;
  if (daysSinceLastActivity > 30) {
    factors.activityScore = 20;
    score -= 25;
    recommendations.push("Your account hasn't been active recently. Log in to improve your health score.");
  } else if (daysSinceLastActivity > 14) {
    factors.activityScore = 50;
    score -= 15;
  } else if (daysSinceLastActivity > 7) {
    factors.activityScore = 75;
    score -= 5;
  }
  
  // Calculate security score
  if (tenant?.plan === "Free") {
    factors.securityScore = 50;
    score -= 10;
    recommendations.push("Upgrade to Enterprise for advanced security features.");
  }
  
  // Determine grade
  let grade = "A";
  if (score < 50) grade = "F";
  else if (score < 60) grade = "D";
  else if (score < 70) grade = "C";
  else if (score < 80) grade = "B";
  
  // Ensure score is between 0-100
  score = Math.max(0, Math.min(100, score));
  
  return {
    tenantId,
    score,
    grade,
    factors,
    details,
    recommendations,
    calculatedAt: new Date()
  };
};

// Static method to get latest health score
healthScoreSchema.statics.getLatestHealthScore = async function(tenantId) {
  return await this.findOne({ tenantId }).sort({ calculatedAt: -1 });
};

// Static method to get health score history
healthScoreSchema.statics.getHealthScoreHistory = async function(tenantId, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return await this.find({
    tenantId,
    calculatedAt: { $gte: startDate }
  }).sort({ calculatedAt: -1 });
};

const HealthScore = mongoose.model("HealthScore", healthScoreSchema);

module.exports = HealthScore;
