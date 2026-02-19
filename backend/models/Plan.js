const mongoose = require("mongoose");

const planSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: ["Free", "Starter", "Pro", "Enterprise"]
  },
  price: {
    monthly: { type: Number, default: 0 },
    yearly: { type: Number, default: 0 }
  },
  limits: {
    maxUsers: { type: Number, default: 3 },
    maxNotes: { type: Number, default: 3 },
    maxStorage: { type: Number, default: 100 }, // MB
    maxAPIRequests: { type: Number, default: 0 } // per month
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
  isPopular: {
    type: Boolean,
    default: false
  },
  description: {
    type: String,
    default: ""
  },
  stripePriceIdMonthly: String,
  stripePriceIdYearly: String
}, { timestamps: true });

// Static method to get all plans
planSchema.statics.getPlans = async function() {
  return await this.find().sort({ price: 1 });
};

// Static method to get plan by name
planSchema.statics.getPlanByName = async function(planName) {
  return await this.findOne({ name: planName });
};

const Plan = mongoose.model("Plan", planSchema);

// Default plans data
const defaultPlans = [
  {
    name: "Free",
    price: { monthly: 0, yearly: 0 },
    limits: { maxUsers: 3, maxNotes: 3, maxStorage: 100, maxAPIRequests: 0 },
    features: {
      apiAccess: false,
      advancedAnalytics: false,
      prioritySupport: false,
      customDomain: false,
      whiteLabel: false,
      auditLogs: false,
      sso: false,
      advancedSecurity: false
    },
    isPopular: false,
    description: "Perfect for getting started"
  },
  {
    name: "Starter",
    price: { monthly: 9, yearly: 90 },
    limits: { maxUsers: 10, maxNotes: 100, maxStorage: 1000, maxAPIRequests: 1000 },
    features: {
      apiAccess: true,
      advancedAnalytics: false,
      prioritySupport: false,
      customDomain: false,
      whiteLabel: false,
      auditLogs: false,
      sso: false,
      advancedSecurity: false
    },
    isPopular: false,
    description: "For small teams just getting started"
  },
  {
    name: "Pro",
    price: { monthly: 29, yearly: 290 },
    limits: { maxUsers: 50, maxNotes: -1, maxStorage: 10000, maxAPIRequests: 10000 },
    features: {
      apiAccess: true,
      advancedAnalytics: true,
      prioritySupport: true,
      customDomain: false,
      whiteLabel: false,
      auditLogs: true,
      sso: false,
      advancedSecurity: false
    },
    isPopular: true,
    description: "For growing businesses"
  },
  {
    name: "Enterprise",
    price: { monthly: 99, yearly: 990 },
    limits: { maxUsers: -1, maxNotes: -1, maxStorage: -1, maxAPIRequests: -1 },
    features: {
      apiAccess: true,
      advancedAnalytics: true,
      prioritySupport: true,
      customDomain: true,
      whiteLabel: true,
      auditLogs: true,
      sso: true,
      advancedSecurity: true
    },
    isPopular: false,
    description: "For large organizations"
  }
];

// Function to seed plans
Plan.seedPlans = async function() {
  for (const plan of defaultPlans) {
    await this.findOneAndUpdate(
      { name: plan.name },
      plan,
      { upsert: true, new: true }
    );
  }
  console.log("Plans seeded successfully");
};

module.exports = Plan;
