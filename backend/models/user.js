const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  // 🔹 Subscription Plan
  plan: {
    type: String,
    enum: ["Free", "Pro", "Enterprise"],
    default: "Free"
  },

  // 🔹 Multi-Tenancy
  tenantId: {
    type: String,
    required: true
  },

  // 🔹 Role-Based Access
  role: {
    type: String,
    enum: ["Admin", "Manager", "User"],
    default: "User"
  },

  // 🔹 Billing Cycle
  billingCycle: {
    type: String,
    enum: ["Monthly", "Yearly"],
    default: "Monthly"
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("User", userSchema);
