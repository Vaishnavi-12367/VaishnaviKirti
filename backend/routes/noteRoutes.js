const express = require("express");
const router = express.Router();
const Note = require("../models/Note");

// Create Note
router.post("/create", async (req, res) => {
  try {
    const { tenantId, title, content } = req.body;

    const user = await User.findOne({ tenantId });

    const notesCount = await Note.countDocuments({ tenantId });

    // FREE plan limit = 3 notes
    if (user.plan === "Free" && notesCount >= 3) {
      return res.status(400).json({
        message: "Free plan allows only 3 notes"
      });
    }

    const newNote = new Note({
      tenantId,
      title,
      content
    });

    await newNote.save();

    res.json({ message: "Note created" });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});



// Get Notes
router.get("/:tenantId", async (req, res) => {
  try {
    const notes = await Note.find({ tenantId: req.params.tenantId });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: "Error fetching notes" });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.json({ message: "Note deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting note" });
  }
});


module.exports = router;

