const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { DBConnection } = require("./database/db.js");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors({
  origin: ["http://localhost:5173", "https://onlinejudgeproject.vercel.app"] ,
  credentials: true
}));
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

DBConnection();

// Base route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "AlgoU Auth Server is running",
    timestamp: new Date().toISOString()
  });
});

// Routes
const authRoutes = require("./routes/authRoutes.js");
app.use("/api/auth", authRoutes);
const userRoutes = require("./routes/userRoutes.js");
app.use("/api/users", userRoutes);
const subRoutes = require("./routes/subRoutes.js");
app.use('/api/submissions',subRoutes);
const problemRoutes= require("./routes/problemRoutes.js");
app.use('/api/problems',problemRoutes);
const aiRoutes = require('./routes/aiRoutes');
app.use('/api/ai', aiRoutes);
const contestRoutes = require("./routes/contestRoutes.js");
app.use("/api/contests", contestRoutes);


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
