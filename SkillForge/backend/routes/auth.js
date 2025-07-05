const express = require("express");
const router = express.Router();
const User = require("../models/User");

// ✅ SIGNUP ROUTE
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  console.log("📩 Signup request received:", { name, email, password });

  if (!name || !email || !password) {
    console.log("⚠️ Missing name, email, or password");
    return res.status(400).json({ message: "Name, email, and password are required." });
  }

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      console.log("⚠️ User already exists:", email);
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User({ name, email, password });
    await newUser.save();

    console.log("✅ New user created:", newUser);
    res.status(201).json({ message: "User created successfully", email });
  } catch (error) {
    console.error("🔥 Signup error:", error.message);
    res.status(500).json({ message: "Server error during signup", error: error.message });
  }
});


// ✅ LOGIN ROUTE
router.post("/login", async (req, res) => {
  const { name, email, password } = req.body;

  console.log("🔐 Login request received:", { email, password });

  if (!email || !password) {
    console.log("⚠️ Email or password missing");
    return res.status(400).json({ message: "Email and password are required." });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      console.log("❌ User not found:", email);
      return res.status(401).json({ message: "Invalid credentials: user not found" });
    }

    if (user.password !== password) {
      console.log("❌ Password mismatch for:", email);
      return res.status(401).json({ message: "Invalid credentials: wrong password" });
    }

    console.log("✅ Login successful for:", email);
    res.status(200).json({ message: "Login successful", email });
  } catch (error) {
    console.error("🔥 Login error:", error.message);
    res.status(500).json({ message: "Server error during login", error: error.message });
  }
});

module.exports = router;
