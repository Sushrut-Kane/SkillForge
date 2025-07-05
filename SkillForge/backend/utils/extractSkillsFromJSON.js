const fs = require("fs");
const path = require("path");

// Load skill bank once
const skillBankPath = path.join(__dirname, "../skill_bank/skills.json");
const skillBank = JSON.parse(fs.readFileSync(skillBankPath, "utf-8"));

// Helper to normalize words (lowercase, remove symbols)
const normalize = (text) =>
  text.toLowerCase().replace(/[^\w\s]/g, "").split(/\s+/);

function extractSkillsFromText(resumeText) {
  const resumeWords = new Set(normalize(resumeText));

  let bestMatchRole = null;
  let bestMatchCount = 0;
  let bestMatchedSkills = [];

  for (const role in skillBank) {
    const { core_skills, advanced_skills, tools } = skillBank[role];
    const allSkills = [...core_skills, ...advanced_skills, ...tools].map((s) =>
      s.toLowerCase()
    );

    const matched = allSkills.filter((skill) => resumeWords.has(skill));
    if (matched.length > bestMatchCount) {
      bestMatchCount = matched.length;
      bestMatchRole = role;
      bestMatchedSkills = matched;
    }
  }

  const relevantSkills = [
    ...skillBank[bestMatchRole].core_skills,
    ...skillBank[bestMatchRole].advanced_skills,
    ...skillBank[bestMatchRole].tools,
  ];
  const normalizedResumeWords = Array.from(resumeWords);

  const foundSkills = relevantSkills.filter((skill) =>
    normalizedResumeWords.includes(skill.toLowerCase())
  );
  const missingSkills = relevantSkills.filter(
    (skill) => !foundSkills.includes(skill)
  );

  return {
    detectedRole: bestMatchRole,
    foundSkills,
    missingSkills,
  };
}

module.exports = extractSkillsFromText;
