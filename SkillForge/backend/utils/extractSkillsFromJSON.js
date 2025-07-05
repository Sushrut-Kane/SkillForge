const fs = require("fs");
const path = require("path");

const skillBankPath = path.join(__dirname, "../skill_bank/skills.json");
const skillBank = JSON.parse(fs.readFileSync(skillBankPath, "utf-8"));

function normalize(text) {
  return text.toLowerCase().replace(/[^\w\s]/g, "").split(/\s+/);
}

function matchRole(textWords) {
  let bestMatch = {
    role: null,
    matchedSkills: [],
    score: 0,
  };

  for (const role in skillBank) {
    const { core_skills = [], advanced_skills = [], tools = [] } = skillBank[role];
    const allSkills = [...core_skills, ...advanced_skills, ...tools].map((s) =>
      s.toLowerCase()
    );

    const matched = allSkills.filter((skill) => textWords.has(skill));

    if (matched.length > bestMatch.score) {
      bestMatch = {
        role,
        matchedSkills: matched,
        score: matched.length,
      };
    }
  }

  return bestMatch;
}

function extractSkillsFromText(resumeText) {
  const normalizedWords = new Set(normalize(resumeText));
  const { role, matchedSkills } = matchRole(normalizedWords);

  if (!role) {
    return {
      detectedRole: "Not Detected",
      foundSkills: [],
      missingSkills: [],
    };
  }

  const allSkills = [
    ...skillBank[role].core_skills,
    ...skillBank[role].advanced_skills,
    ...skillBank[role].tools,
  ];

  const foundSkills = allSkills.filter((skill) =>
    normalizedWords.has(skill.toLowerCase())
  );

  const missingSkills = allSkills.filter(
    (skill) => !foundSkills.includes(skill)
  );

  return {
    detectedRole: role,
    foundSkills: foundSkills.sort(),
    missingSkills: missingSkills.sort(),
  };
}

module.exports = extractSkillsFromText;
