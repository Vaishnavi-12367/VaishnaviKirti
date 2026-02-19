const mongoose = require("mongoose");

const tenantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    unique: true,
    sparse: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  plan: {
    type: String,
    enum: ["Free", "Starter", "Pro", "Enterprise"],
    default: "Free"
  },
  status: {
    type: String,
    enum: ["active", "suspended", "cancelled"],
    default: "active"
  },
  billingCycle: {
    type: String,
    enum: ["Monthly", "Yearly"],
    default: "Monthly"
  },
  stripeCustomerId: String,
  stripeSubscriptionId: String,
  subscriptionEndDate: Date,
  settings: {
    allowSignup: {
      type: Boolean,
      default: true
    },
    maxUsers: {
      type: Number,
      default: 3
    },
    maxNotes: {
      type: Number,
      default: 3
    },
    maxStorage: {
      type: Number,
      default: 100 // MB
    },
    enableAnalytics: {
      type: Boolean,
      default: false
    },
    enableAPI: {
      type: Boolean,
      default: false
    },
    customBranding: {
      type: Boolean,
      default: false
    }
  },
  features: {
    apiAccess: { type: Boolean, default: false },
    advancedAnalytics: { type: Boolean, default: false },
    prioritySupport: { type: Boolean, default: false },
    customDomain: { type: Boolean, default: false },
    whiteLabel: { type: Boolean, default: false },
    auditLogs: { type: Boolean, default: false },
    sso: { type: Boolean, default: false },
    advancedSecurity: { type: Boolean, default: false }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

tenantSchema.pre("save", function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Tenant", tenantSchema);
