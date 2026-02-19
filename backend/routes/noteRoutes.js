const express = require("express");
const router = express.Router();
const Note = require("../models/Note");
const verifyToken = require("../middleware/authMiddleware");
const Activity = require("../models/Activity");


// CREATE
router.post("/create", verifyToken, async (req, res) => {
  try {
    const { title, content } = req.body;   // ❌ removed tenantId from here
    const tenantId = req.user.tenantId;    // ✅ only declared once

    const user = await User.findOne({ tenantId });

    const existingNotes = await Note.find({ tenantId });

    if (user.plan === "Free" && existingNotes.length >= 3) {
      return res.status(403).json({
        message: "Free plan allows only 3 notes"
      });
    }

    const newNote = new Note({
      tenantId,
      title,
      content
    });

    await newNote.save();

    await Activity.create({
  tenantId,
  userEmail: req.user.email,
  action: "Created a note"
});


    res.json({ message: "Note created" });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});



// GET NOTES
router.get("/", verifyToken, async (req, res) => {
  try {
    const notes = await Note.find({
      tenantId: req.user.tenantId
    });

    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: "Error fetching notes" });
  }
});


// DELETE
router.delete("/delete/:id",verifyToken,   async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);

    await Activity.create({
  tenantId: req.user.tenantId,
  userEmail: req.user.email,
  action: "Deleted a note"
});

    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting" });
  }
});

// UPDATE
router.put("/update/:id", verifyToken, async (req, res) => {
  try {
    const { title, content } = req.body;

    await Note.findByIdAndUpdate(
      req.params.id,
      { title, content }
    );

    res.json({ message: "Note updated" });

  } catch (err) {
    res.status(500).json({ message: "Error updating note" });
  }
});


module.exports = router;
