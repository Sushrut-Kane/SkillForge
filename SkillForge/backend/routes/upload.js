const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const fs = require("fs").promises;
const extractSkillsFromText = require("../utils/extractSkillsFromJSON");
const getFeedbackFromGemini = require("../utils/geminiFeedback");

const router = express.Router();

// Multer disk storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const filePath = req.file.path;
    const fileBuffer = await fs.readFile(filePath);
    const data = await pdfParse(fileBuffer);
    const text = data.text;

    const { foundSkills, missingSkills } = extractSkillsFromText(text);
    const aiFeedback = await getFeedbackFromGemini(text);

    res.status(200).json({
      message: "Resume parsed and analyzed successfully",
      extractedText: text.slice(0, 1000),
      foundSkills,
      missingSkills,
      aiFeedback, // ✅ AI Feedback
    });

  } catch (err) {
    console.error("❌ Error during upload/analysis:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
});

module.exports = router;
