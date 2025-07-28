const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API);

exports.generateAIFields = async (req, res) => {
  try {
    const { description } = req.body;

    const prompt = `You're helping build a coding platform. Given the problem description, generate:

1. Title
2. Input Format
3. Output Format
4. Constraints
5. Exactly 2 sample Test Cases (just Input and Output, explanation in 1 2 lines)
6. Tags (comma-separated)
7. Difficulty (Easy/Medium/Hard)

Description: ${description}

Respond in JSON format:
{
  "title": "",
  "inputFormat": "",
  "outputFormat": "",
  "constraints": "",
  "testCases": [
    {
      "input": "",
      "output": ""
    },
    {
      "input": "",
      "output": ""
    }
  ],
  "tags": [],
  "difficulty": ""
}`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const content = response.text();

    // Try parsing the JSON from Gemini response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON in Gemini response");

    const data = JSON.parse(jsonMatch[0]);
    res.json(data);
  } catch (err) {
    console.error("Gemini Error:", err.message);
    res.status(500).json({ error: "AI generation failed." });
  }
};
