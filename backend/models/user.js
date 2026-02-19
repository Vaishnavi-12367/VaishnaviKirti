const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  tenantId: String,
  role: {
    type: String,
    enum: ["Admin", "Member"],
    default: "Admin"
  },
  plan: {
    type: String,
    default: "Free"
  },
  billingCycle: {
    type: String,
    default: "Monthly"
  }
});

module.exports = mongoose.model("User", userSchema);
