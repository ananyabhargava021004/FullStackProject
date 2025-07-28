import React, { useEffect, useState } from "react";
import { API, compilerAPI } from "../api";
import { useParams } from "react-router-dom";

function ProblemDetail() {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState("cpp");
  const [testCaseResults, setTestCaseResults] = useState([]);
  const [customInput, setCustomInput] = useState("");
  const [aiReview, setAiReview] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);

  useEffect(() => {
    fetchProblem();
  }, []);

  const fetchProblem = async () => {
    const res = await API.get(`/api/problems/${id}`);
    setProblem(res.data);
  };

  const handleRun = async () => {
    setLoading(true);
    setOutput("");
    try {
      const res = await compilerAPI.post("/run", {
        language,
        code,
        input: customInput,
      });
      setOutput(res.data.output);
    } catch (err) {
      setOutput(err.response?.data?.error || err.message);
    }
    setLoading(false);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setTestCaseResults([]);
    let results = [];

    const normalize = (str) => str.replace(/\s+/g, "").trim();

    for (let i = 0; i < problem.testCases.length; i++) {
      const test = problem.testCases[i];
      try {
        const res = await compilerAPI.post("/run", {
          language,
          code,
          input: test.input,
        });
    
        const actualOutput = normalize(res.data.output || "");
        const expectedOutput = normalize(test.output || "");


        results.push({
          testCase: i + 1,
          passed: actualOutput === expectedOutput,
          actual: actualOutput,
          expected: expectedOutput,
        });
      } catch (err) {
        results.push({
          testCase: i + 1,
          passed: false,
          error: err.response?.data?.error || err.message,
        });
      }
    }

    setTestCaseResults(results);
    setLoading(false);
  };

  const handleAIReview = async () => {
    setReviewLoading(true);
    setAiReview("🤖");
    try {
      const res = await compilerAPI.post("/ai-review", { code });
      setAiReview(res.data.aiResponse || "No review generated.");
    } catch (err) {
      setAiReview(err.response?.data?.error || err.message);
    }
    setReviewLoading(false);
  };

  if (!problem) return <p>Loading problem...</p>;

  return (
    <div style={{ display: "flex", padding: "20px", gap: "20px" }}>
      <div style={{ flex: 1 }}>
        <h2>{problem.title}</h2>
        <p>{problem.description}</p>
        <h4>Constraints:</h4>
        <p>{problem.constraints}</p>
        <h4>Test Cases:</h4>
        {problem.testCases.map((test, idx) => (
          <div
            key={idx}
            style={{
              marginBottom: "12px",
              padding: "8px",
              border: "1px solid #ddd",
              borderRadius: "6px",
            }}
          >
            <strong>Test Case {idx + 1}</strong>
            <br />
            <strong>Input:</strong> <pre>{test.input}</pre>
            <strong>Expected Output:</strong> <pre>{test.output}</pre>
          </div>
        ))}
      </div>

      <div style={{ flex: 1 }}>
        <label>Select Language: </label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          style={{ marginBottom: "10px" }}
        >
          <option value="cpp">C++</option>
          <option value="c">C</option>
          <option value="java">Java</option>
          <option value="python">Python</option>
        </select>

        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          rows="15"
          placeholder="Write your code here..."
          style={{
            width: "100%",
            padding: "10px",
            fontFamily: "monospace",
            fontSize: "15px",
            marginBottom: "10px",
          }}
        />

        <h4>Custom Input:</h4>
        <textarea
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          rows="3"
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />

        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
          <button onClick={handleRun} disabled={loading}>
            {loading ? "Running..." : "Run"}
          </button>
          <button onClick={handleSubmit} disabled={loading}>
            {loading ? "Checking..." : "Submit"}
          </button>
          <button onClick={handleAIReview} disabled={reviewLoading}>
            {reviewLoading ? "Reviewing..." : "AI Review"}
          </button>
        </div>

        <h4>Output:</h4>
        <pre
          style={{
            background: "#f3f3f3",
            padding: "14px",
            borderRadius: "6px",
            minHeight: "50px",
          }}
        >
          {loading ? "Running..." : output || "No output yet."}
        </pre>

        <h4>Test Case Results:</h4>
        {testCaseResults.length === 0 ? (
          <p>No test cases run yet.</p>
        ) : (
          testCaseResults.map((result) => (
            <div
              key={result.testCase}
              style={{
                marginBottom: "8px",
                padding: "6px 10px",
                borderRadius: "6px",
                background: result.passed ? "#d4edda" : "#f8d7da",
                color: result.passed ? "#155724" : "#721c24",
              }}
            >
              ✅ Test Case {result.testCase} —{" "}
              {result.passed ? "Passed" : "Failed"}
              {!result.passed && (
                <>
                  <br />
                  <strong>Expected:</strong> {result.expected}
                  <br />
                  <strong>Got:</strong> {result.actual || result.error}
                </>
              )}
            </div>
          ))
        )}

        <h4>AI Review:</h4>
        <pre
          style={{
            background: "#eef6fc",
            padding: "14px",
            borderRadius: "6px",
            minHeight: "50px",
            whiteSpace: "pre-wrap",
          }}
        >
          {reviewLoading ? "Analyzing with 🤖..." : aiReview || ""}
        </pre>
      </div>
    </div>
  );
}

export default ProblemDetail;
