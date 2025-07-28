// utils/aiGenerator.js

function generateExample(description) {
  // This is a placeholder — in production, use an AI model or service
  if (description.includes("sum")) {
    return {
      exampleInput: "3 5",
      exampleOutput: "8",
      testCases: [
        { input: "2 2", output: "4" },
        { input: "10 15", output: "25" }
      ]
    };
  }

  return {
    exampleInput: "1",
    exampleOutput: "1",
    testCases: [
      { input: "2", output: "2" },
      { input: "3", output: "3" }
    ]
  };
}

module.exports = { generateExample };
