const { GoogleGenAI } = require("@google/genai");
const dotenv = require("dotenv");
dotenv.config();
const ai = new GoogleGenAI({apiKey: process.env.GOOGLE_GEMINI_API});

const generateAiResponse = async (code) => {
  // ✅ Use proper template string
  const prompt = `Analyze the following code and provide a short, precise, crisp review:\n\n${code}`;

  const result = await ai.models.generateContent({
    model: "gemini-1.5-flash",  // or "gemini-1.5-flash" / "gemini-pro"
     contents: [{ role: "user", parts: [{ text: prompt }] }],
  });

  // ✅ Accessing the response correctly
  const text = result.response.candidates[0].content.parts[0].text;
  return text;
};

module.exports = generateAiResponse;