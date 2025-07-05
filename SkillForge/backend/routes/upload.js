const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const fs = require("fs").promises;
const path = require("path");

const extractSkillsFromText = require("../utils/extractSkillsFromJSON");
const getFeedbackFromGemini = require("../utils/geminiFeedback");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

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

router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const fileBuffer = await fs.readFile(req.file.path);
    const { text } = await pdfParse(fileBuffer);

    const { detectedRole, foundSkills, missingSkills } = extractSkillsFromText(text);

    const aiPrompt = `
You are a career assistant. Given this resume content, generate short structured feedback.
- Address the person directly (use "You", not "he"/"she").
- Avoid paragraphs. Break the feedback into:
  1. Strengths
  2. Areas to Improve
  3. Recommendations
- Avoid overexplaining each section.
- Keep it professional and clean.

Resume Content:
"""${text}"""
    `.trim();

    const summary = await getFeedbackFromGemini(aiPrompt);

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
