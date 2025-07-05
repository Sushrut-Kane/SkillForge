const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const fs = require("fs").promises;
const extractSkillsFromText = require("../utils/extractSkillsFromJSON");
const getFeedbackFromGemini = require("../utils/geminiFeedback");

const router = express.Router();

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
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const filePath = req.file.path;
    const fileBuffer = await fs.readFile(filePath);
    const data = await pdfParse(fileBuffer);
    const text = data.text;

    const { detectedRole, foundSkills, missingSkills } = extractSkillsFromText(text);

    const aiFeedbackText = await getFeedbackFromGemini(text);

    const formattedFeedback = `
      <h3>Detected Role:</h3>
      <p><strong>${detectedRole}</strong></p>

      <h3>Missing Skills:</h3>
      <ul>
        ${missingSkills.map(skill => `<li>${skill}</li>`).join("")}
      </ul>

      <h3>Resume Feedback:</h3>
      <p>${aiFeedbackText}</p>
    `;

    res.status(200).json({
      message: "Resume parsed and analyzed successfully",
      detectedRole,
      foundSkills,
      missingSkills,
      feedbackHTML: formattedFeedback,
    });
  } catch (err) {
    console.error("Error during upload/analysis:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
});

module.exports = router;
