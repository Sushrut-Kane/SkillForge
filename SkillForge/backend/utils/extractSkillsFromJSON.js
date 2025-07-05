const fs = require("fs");
const path = require("path");

const skillBankPath = path.join(__dirname, "../skill_bank/skills.json");
const rawData = fs.readFileSync(skillBankPath);
const skillBank = JSON.parse(rawData);

// 🔍 Flatten all skills into one unique list
const allSkillsSet = new Set();

for (const role in skillBank) {
  const { core_skills, advanced_skills, tools } = skillBank[role];
  [...core_skills, ...advanced_skills, ...tools].forEach((skill) =>
    allSkillsSet.add(skill.toLowerCase())
  );
}

const allSkills = Array.from(allSkillsSet);

function extractSkillsFromText(text) {
  const lowerText = text.toLowerCase();

  const foundSkills = allSkills.filter((skill) =>
    lowerText.includes(skill)
  );

  const missingSkills = allSkills.filter(
    (skill) => !foundSkills.includes(skill)
  );

  return { foundSkills, missingSkills };
}

module.exports = extractSkillsFromText;
