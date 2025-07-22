const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const fs = require("fs").promises;

const extractSkillsFromText = require("../utils/extractSkillsFromJSON");
const getFeedbackFromGemini = require("../utils/geminiFeedback");

const router = express.Router();

// Configure multer to store uploaded PDFs
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

// HTML formatter for frontend rendering
const formatFeedbackAsHTML = ({ detectedRole, missingSkills, summary }) => {
  const trimmedSkills = missingSkills.slice(0, 5);
  return `
    <div class="feedback-box">
      <h3>Detected Role: <span class="highlight">${detectedRole}</span></h3>

      <h4>Top Missing Skills (based on your resume):</h4>
      <ul class="skill-list">
        ${trimmedSkills.map(skill => `<li>${skill}</li>`).join("")}
      </ul>

      <h4>Resume Feedback:</h4>
      ${summary}
    </div>
  `;
};

// Handle resume upload and processing
router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const fileBuffer = await fs.readFile(req.file.path);
    const { text } = await pdfParse(fileBuffer);

    // Extract role and skills
    const { detectedRole, foundSkills, missingSkills } = extractSkillsFromText(text);

    // Generate structured AI feedback (will use proper HTML format)
    const summary = await getFeedbackFromGemini(text);

    // Format final result for frontend
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
