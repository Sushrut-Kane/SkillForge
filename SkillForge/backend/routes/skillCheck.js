const express = require("express");
const router = express.Router();
const skillBank = require("../skill_bank/skills.json");

router.post("/check-gap", (req, res) => {
  const { role, resumeSkills } = req.body;

  if (!skillBank[role]) {
    return res.status(400).json({ error: "Invalid role selected" });
  }

  const { core_skills, advanced_skills } = skillBank[role];

  const requiredSkills = [...core_skills, ...advanced_skills].map(s => s.toLowerCase());
  const userSkills = resumeSkills.map(s => s.toLowerCase());

  const missingSkills = requiredSkills.filter(skill => !userSkills.includes(skill));

  res.json({
    role,
    totalRequired: requiredSkills.length,
    matched: requiredSkills.length - missingSkills.length,
    missingSkills
  });
});

module.exports = router;
