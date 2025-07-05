const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const fs = require("fs").promises;
const path = require("path");

const extractSkillsFromText = require("../utils/extractSkillsFromJSON");
const getFeedbackFromGemini = require("../utils/geminiFeedback");

const router = express.Router();

// Format feedback into cleaner HTML
const formatFeedbackAsHTML = ({ detectedRole, missingSkills, summary }) => {
  return `
    <div class="feedback-box">
      <h3>Detected Role: <span class="highlight">${detectedRole}</span></h3>

      <h4>Missing Skills:</h4>
      <ul class="skill-list">
        ${missingSkills.map(skill => `<li>${skill}</li>`).join("")}
      </ul>

      <h4>Resume Feedback:</h4>
      <p>${summary.length > 700 ? summary.slice(0, 700) + "..." : summary}</p>
    </div>
  `;
};

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const fileBuffer = await fs.readFile(req.file.path);
    const { text } = await pdfParse(fileBuffer);

    const { detectedRole, foundSkills, missingSkills } = extractSkillsFromText(text);

    const summary = await getFeedbackFromGemini(text);

    const feedbackHTML = formatFeedbackAsHTML({
      detectedRole,
      missingSkills,
      summary,
    });

    res.status(200).json({
      message: "Resume parsed and analyzed successfully",
      detectedRole,
      foundSkills,
      missingSkills,
      feedbackHTML,
    });
  } catch (err) {
    console.error("Error during upload/analysis:", err);
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
});

module.exports = router;
