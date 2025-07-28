import React, { useState } from "react";
import { API } from "../api";
import "../App.css";

const CreateProblem = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    inputFormat: "",
    outputFormat: "",
    constraints: "",
    testCases: [
      { input: "", output: "" },
      { input: "", output: "" },
    ],
    tags: [],
    difficulty: "",
  });

  const [aiLoading, setAiLoading] = useState(false);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAI = async () => {
    try {
      setAiLoading(true);
      setMessage("");
      const res = await API.post(
        "/api/ai/generate",
        { description: form.description },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const {
        title,
        inputFormat,
        outputFormat,
        constraints,
        testCases,
        tags,
        difficulty,
      } = res.data;

      // ✅ Trim testCases to first 2 if present and well-formed
      const validTestCases =
        Array.isArray(testCases) && testCases.length > 0
          ? testCases.slice(0, 2)
          : [
              { input: "", output: "" },
              { input: "", output: "" },
            ];

      setForm((prev) => ({
        ...prev,
        title,
        inputFormat,
        outputFormat,
        constraints,
        testCases: validTestCases,
        tags,
        difficulty,
      }));
    } catch (err) {
      console.error(err);
      setMessage("⚠️ AI generation failed. Please try again.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/api/problems/create", form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage("✅ Problem created successfully!");
    } catch (err) {
      console.error(err);
      setMessage("❌ Problem creation failed.");
    }
  };

  return (
    <div className="create-problem-container">
      <h2>Create a Coding Problem</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Enter problem description"
          name="description"
          value={form.description}
          onChange={handleChange}
          required
        />

        <button type="button" onClick={handleAI} disabled={aiLoading}>
          {aiLoading ? "Generating..." : "Auto Fill with AI"}
        </button>

        <input
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <textarea
          name="inputFormat"
          placeholder="Input Format"
          value={form.inputFormat}
          onChange={handleChange}
        />
        <textarea
          name="outputFormat"
          placeholder="Output Format"
          value={form.outputFormat}
          onChange={handleChange}
        />
        <textarea
          name="constraints"
          placeholder="Constraints"
          value={form.constraints}
          onChange={handleChange}
        />
        {form.testCases.map((tc, index) => (
          <div key={index}>
            <textarea
              placeholder={`Test Case ${index + 1} - Input`}
              value={tc.input}
              onChange={(e) => {
                const newTC = [...form.testCases];
                newTC[index].input = e.target.value;
                setForm((prev) => ({ ...prev, testCases: newTC }));
              }}
            />
            <textarea
              placeholder={`Test Case ${index + 1} - Output`}
              value={tc.output}
              onChange={(e) => {
                const newTC = [...form.testCases];
                newTC[index].output = e.target.value;
                setForm((prev) => ({ ...prev, testCases: newTC }));
              }}
            />
          </div>
        ))}

        <input
          type="text"
          name="tags"
          placeholder="Tags (comma separated)"
          value={form.tags.join(",")}
          onChange={(e) =>
            setForm({ ...form, tags: e.target.value.split(",").map(tag => tag.trim()) })
          }
        />

        <select
          name="difficulty"
          value={form.difficulty}
          onChange={handleChange}
        >
          <option value="">Select Difficulty</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>

        <button type="submit">Create Problem</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default CreateProblem;
