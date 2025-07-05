const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function getFeedbackFromGemini(resumeText) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
You are an AI resume assistant. Analyze the given resume and provide structured feedback in the following format:
1. **Strengths** – What the user does well.
2. **Areas to Improve** – Key skill or content gaps.
3. **Recommendations** – Short actionable tips.

Guidelines:
- Address the person directly (use "you", not "he"/"she").
- Be professional and clear.
- Avoid large paragraphs – use short, clear bullet points.
- Do not mention you're an AI or that this is AI-generated.

Resume Text:
"""
${resumeText}
"""
`.trim();

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API Error:", error.message);
    return "We couldn't generate feedback at the moment. Please try again later.";
  }
}

module.exports = getFeedbackFromGemini;
