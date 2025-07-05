const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const pdfParse = require("pdf-parse");

// Configure Multer
const upload = multer({ dest: "uploads/" });

// POST /api/resume/upload
router.post("/upload", upload.single("resume"), async (req, res) => {
  try {
    const filePath = req.file.path;

    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(dataBuffer);

    const extractedText = pdfData.text;

    // For now just return the plain text
    res.json({ text: extractedText });

    // Clean up the uploaded file
    fs.unlinkSync(filePath);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Resume processing failed" });
  }
});

module.exports = router;
