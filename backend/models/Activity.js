const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  tenantId: String,
  userEmail: String,
  action: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Activity", activitySchema);
