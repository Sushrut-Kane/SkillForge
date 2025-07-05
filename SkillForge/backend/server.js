const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // To parse JSON bodies

// Routes
const authRoutes = require("./routes/auth");
const uploadRoute = require("./routes/upload");
const resumeRoutes = require("./routes/resume");

app.use("/api/auth", authRoutes);      // Auth routes
app.use("/api/upload", uploadRoute);   // Upload PDF route
app.use("/api/resume", resumeRoutes);  // Resume analysis route (if used)

// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
