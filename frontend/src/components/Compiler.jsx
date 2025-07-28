import React, { useState } from "react";
import { compilerAPI } from "../api";
import Editor from "@monaco-editor/react";

function Compiler() {
  const [code, setCode] = useState("");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [aiReview, setAiReview] = useState("");
  const [loading, setLoading] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);


  const [language, setLanguage] = useState("cpp");

  const handleRun = async () => {
    setLoading(true);
    setOutput("");
    setAiReview("");
    try {
      const res = await compilerAPI.post("/run", {
        language,
        code,
        input,
      });
      setOutput(res.data.output || "No output returned.");
    } catch (err) {
      setOutput(err.response?.data?.error || err.message);
    }
    setLoading(false);
  };

  const handleAIReview = async () => {
    setReviewLoading(true);
    setAiReview("🤖");
    try {
      const res = await compilerAPI.post("/ai-review", { code });
      setAiReview(res.data.aiResponse || "No review generated.");
      setReviewLoading(false);
    } catch (err) {
      setAiReview(err.response?.data?.error || err.message);
      setReviewLoading(false);
    }
    
  };

  return (
    <div className="page-center">
      <div className="form-card" style={{ width: "900px" }}>
        <h2>Code Compiler</h2>

        <div style={{ marginBottom: "10px" }}>
          <label>Select Language: </label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            style={{ marginLeft: "10px" }}
          >
            <option value="cpp">C++</option>
            <option value="c">C</option>
            <option value="java">Java</option>
            <option value="python">Python</option>
          </select>
        </div>

        <Editor
          height="400px"
          language="javascript"
          value={code}
          onChange={(value) => setCode(value)}
          options={{
            automaticLayout: true,
            minimap: { enabled: false },
            fontSize: 16,
          }}
        />

        <h3>Input</h3>
        <textarea
          placeholder="Enter input values..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={3}
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />

        <h3>Output</h3>
        <pre
          style={{
            background: "#f3f3f3",
            padding: "14px",
            borderRadius: "6px",
            minHeight: "50px",
          }}
        >
          {loading ? "Running..." : output || ""}
        </pre>

        <h3>AI Review</h3>
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

        <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
          <button onClick={handleRun} className="btn btn-primary">
            Run
          </button>
          <button onClick={handleAIReview} className="btn btn-success">
            AI Review
          </button>
        </div>
      </div>
    </div>
  );
}

export default Compiler;
