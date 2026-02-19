const mongoose = require("mongoose");

const usageSchema = new mongoose.Schema({
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tenant",
    required: true
  },
  metric: {
    type: String,
    required: true,
    enum: [
      "notes",
      "users",
      "storage",
      "api_requests",
      "logins",
      "transactions"
    ]
  },
  count: {
    type: Number,
    default: 0
  },
  limit: {
    type: Number,
    default: 0
  },
  period: {
    type: String,
    required: true,
    enum: ["daily", "monthly", "yearly"]
  },
  periodStart: {
    type: Date,
    required: true
  },
  periodEnd: {
    type: Date,
    required: true
  }
}, { timestamps: true });

// Compound index for efficient queries
usageSchema.index({ tenantId: 1, metric: 1, period: 1, periodStart: 1 });

// Static method to get current usage
usageSchema.statics.getCurrentUsage = async function(tenantId, metric, period = "monthly") {
  const now = new Date();
  let periodStart, periodEnd;

  if (period === "daily") {
    periodStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    periodEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  } else if (period === "monthly") {
    periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
    periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  } else {
    periodStart = new Date(now.getFullYear(), 0, 1);
    periodEnd = new Date(now.getFullYear() + 1, 0, 1);
  }

  const usage = await this.findOne({
    tenantId,
    metric,
    period,
    periodStart,
    periodEnd
  });

  return usage;
};

// Static method to increment usage
usageSchema.statics.incrementUsage = async function(tenantId, metric, amount = 1, period = "monthly") {
  const now = new Date();
  let periodStart, periodEnd;

  if (period === "daily") {
    periodStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    periodEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  } else if (period === "monthly") {
    periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
    periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  } else {
    periodStart = new Date(now.getFullYear(), 0, 1);
    periodEnd = new Date(now.getFullYear() + 1, 0, 1);
  }

  const usage = await this.findOneAndUpdate(
    {
      tenantId,
      metric,
      period,
      periodStart,
      periodEnd
    },
    {
      $inc: { count: amount }
    },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true
    }
  );

  return usage;
};

// Static method to get all usage for a tenant
usageSchema.statics.getAllUsage = async function(tenantId, period = "monthly") {
  const now = new Date();
  let periodStart, periodEnd;

  if (period === "monthly") {
    periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
    periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  } else {
    periodStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    periodEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  }

  const usage = await this.find({
    tenantId,
    period,
    periodStart,
    periodEnd
  });

  return usage;
};

const Usage = mongoose.model("Usage", usageSchema);

module.exports = Usage;
