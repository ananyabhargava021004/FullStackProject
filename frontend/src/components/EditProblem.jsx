import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API } from "../api";
import "../App.css";

const EditProblem = () => {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await API.get(`/api/problems/${id}`);
        setForm(res.data);
      } catch (err) {
        setMessage("❌ Failed to fetch problem.");
      }
    };
    fetchProblem();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTagsChange = (e) => {
    setForm((prev) => ({
      ...prev,
      tags: e.target.value.split(",").map((tag) => tag.trim()),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/api/problems/${id}`, form, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
      setMessage("✅ Problem updated!");
    } catch (err) {
      console.error(err.response?.data || err.message);
      setMessage("❌ Update failed.");
    }
  };

  if (!form) return <p className="message">Loading...</p>;

  return (
    <div className="create-problem-container">
      <h2>Edit Problem</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          required
        />
        <textarea
          name="inputFormat"
          value={form.inputFormat}
          onChange={handleChange}
        />
        <textarea
          name="outputFormat"
          value={form.outputFormat}
          onChange={handleChange}
        />
        <textarea
          name="constraints"
          value={form.constraints}
          onChange={handleChange}
        />
        {form.testCases?.map((tc, index) => (
          <div key={index}>
          <textarea
            placeholder={`Test Case ${index + 1} - Input`}
            value={tc.input}
            onChange={(e) => {
              const updatedTC = [...form.testCases];
              updatedTC[index].input = e.target.value;
              setForm((prev) => ({ ...prev, testCases: updatedTC }));
            }}
          />
          <textarea
            placeholder={`Test Case ${index + 1} - Output`}
            value={tc.output}
            onChange={(e) => {
              const updatedTC = [...form.testCases];
              updatedTC[index].output = e.target.value;
              setForm((prev) => ({ ...prev, testCases: updatedTC }));
            }}
          />
          </div>
        ))}

        <input
          type="text"
          name="tags"
          value={form.tags?.join(", ") || ""}
          onChange={handleTagsChange}
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

        <button type="submit">Save Changes</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default EditProblem;
