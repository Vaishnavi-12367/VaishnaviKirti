require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");


console.log("ENV TEST:", process.env.MONGO_URI);

const app = express();
app.use(cors());   
app.use(express.json());

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.log(err));

// ✅ Test Route
app.get("/", (req, res) => {
  res.send("SaaS Backend Running 🚀");
});

// ✅ Future Routes (we’ll create these next)
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/notes", require("./routes/noteRoutes"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
