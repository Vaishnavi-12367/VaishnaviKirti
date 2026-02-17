const express = require("express");
const router = express.Router();
const User = require("../models/User");

// ======================
// SIGNUP
// ======================
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const tenantId = Date.now().toString();

    const newUser = new User({
      name,
      email,
      password,
      tenantId,
      role: "Admin",
      plan: "Free",
      billingCycle: "Monthly"
    });

    await newUser.save();

    res.json({ message: "User created successfully" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

// ======================
// LOGIN
// ======================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("👉 EMAIL FROM FRONTEND:", email);
    console.log("👉 PASSWORD FROM FRONTEND:", password);

    const user = await User.findOne({ email });

    console.log("👉 USER FOUND IN DB:", user);

    if (!user || user.password !== password) {
      console.log("❌ Invalid credentials");
      return res.status(400).json({ message: "Invalid credentials" });
    }

    console.log("✅ Login success");

    res.json({
      email: user.email,
      plan: user.plan,
      role: user.role,
      tenantId: user.tenantId,
      billingCycle: user.billingCycle
    });

  } catch (error) {
    console.log("🔥 SERVER ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// ======================
// GET USER
// ======================
router.get("/me/:email", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      email: user.email,
      plan: user.plan,
      role: user.role,
      tenantId: user.tenantId,
      billingCycle: user.billingCycle
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ======================
// UPGRADE PLAN
// ======================
router.put("/upgrade", async (req, res) => {
  try {
    const { email } = req.body;

    await User.findOneAndUpdate(
      { email },
      { plan: "Pro" }
    );

    res.json({ message: "Upgraded to Pro" });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
