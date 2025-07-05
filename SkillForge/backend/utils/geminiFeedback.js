const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs").promises;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY); // store key in .env

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function getFeedbackFromGemini(resumeText) {
  const prompt = `
You are an intelligent career assistant. A user has uploaded the following resume text:

"""
${resumeText}
"""

Please analyze the resume and provide:
1. A short summary of the candidate's background.
2. The domains they seem to be skilled in.
3. Any obvious skill gaps or areas where they could improve.
4. Learning resources or topics they can study to enhance their profile.

Respond in structured paragraphs.
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (err) {
    console.error("Gemini error:", err);
    throw new Error("Gemini failed to analyze resume.");
  }
}

module.exports = getFeedbackFromGemini;
