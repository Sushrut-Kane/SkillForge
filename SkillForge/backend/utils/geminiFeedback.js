const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// You can switch this model if needed
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function getFeedbackFromGemini(resumeText) {
  const prompt = `
You are a career development assistant. A user has uploaded their resume. Your task is to analyze the resume and give professional feedback **directly to the user** in the second person (use "you", not "he/she").

Resume Text:
"""
${resumeText}
"""

Respond ONLY in clean HTML using this structure:

<h4>Strengths:</h4>
<ul>
  <li>Mention a strong skill, project, or experience.</li>
  <li>Mention a technical tool or domain the user seems confident in.</li>
</ul>

<h4>Areas for Improvement:</h4>
<ul>
  <li>Mention a gap or weakness, such as lack of deployment skills, missing backend experience, etc.</li>
  <li>Mention things the user didn’t include or explain well.</li>
</ul>

<h4>Recommended Learning Resources:</h4>
<ul>
  <li>Recommend one or two specific technologies to learn (e.g., Flask, Docker, GCP, etc.)</li>
  <li>Include short actionable suggestions (e.g., “Build and deploy a REST API using Flask and PostgreSQL”)</li>
</ul>

Constraints:
- No paragraphs, only bullet points.
- Speak directly to the user.
- Be short, impactful, and tailored to their resume content.
- Do NOT mention or summarize the resume — just give direct feedback.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text(); // This is the cleaned HTML Gemini will return
  } catch (err) {
    console.error("Gemini error:", err);
    throw new Error("Gemini failed to analyze resume.");
  }
}

module.exports = getFeedbackFromGemini;
