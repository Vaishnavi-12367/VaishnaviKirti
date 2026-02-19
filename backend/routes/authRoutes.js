const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Activity = require("../models/Activity");



// ======================
// SIGNUP
// ======================
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const tenantId = Date.now().toString();

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
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

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        email: user.email,
        tenantId: user.tenantId,
        role: user.role
      },
      "secretkey123",
      { expiresIn: "1d" }
    );

    res.json({
      token,
      email: user.email,
      plan: user.plan,
      role: user.role,
      tenantId: user.tenantId,
      billingCycle: user.billingCycle
    });

  } catch (error) {
    console.log(error);
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


// ======================
// INVITE MEMBER (Admin Only)
// ======================
router.post("/invite", async (req, res) => {
  try {
    const { name, email, password, tenantId, role } = req.body;

    if (role !== "Admin") {
      return res.status(403).json({ message: "Only Admin can invite members" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newMember = new User({
      name,
      email,
      password: hashedPassword,
      tenantId,
      role: "Member",
      plan: "Free",
      billingCycle: "Monthly"
    });

    await newMember.save();

    res.json({ message: "Member invited successfully" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/team/:tenantId", async (req, res) => {
  try {
    const users = await User.find({
      tenantId: req.params.tenantId
    });

    res.json({ totalMembers: users.length });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET TEAM MEMBERS
router.get("/team/:tenantId", async (req, res) => {
  try {
    const members = await User.find({
      tenantId: req.params.tenantId
    }).select("-password");

    res.json(members);

  } catch (err) {
    res.status(500).json({ message: "Error fetching team" });
  }
});


router.put("/change-password", async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.findOneAndUpdate(
      { email },
      { password: hashedPassword }
    );

    res.json({ message: "Password updated successfully" });

  } catch (err) {
    res.status(500).json({ message: "Error updating password" });
  }
});

router.delete("/remove-member/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "Admin") {
      return res.status(403).json({ message: "Cannot remove Admin" });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({ message: "Member removed successfully" });

  } catch (err) {
    res.status(500).json({ message: "Error removing member" });
  }
});

router.get("/activity/:tenantId", async (req, res) => {
  try {
    const activities = await Activity.find({
      tenantId: req.params.tenantId
    }).sort({ createdAt: -1 });

    res.json(activities);
  } catch (err) {
    res.status(500).json({ message: "Error fetching activity" });
  }
});
// UPDATE BILLING CYCLE
router.put("/billing-cycle", async (req, res) => {
  try {
    const { email, billingCycle } = req.body;

    await User.findOneAndUpdate(
      { email },
      { billingCycle }
    );

    res.json({ message: "Billing cycle updated" });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});



module.exports = router;
