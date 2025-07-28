import React, { useState, useEffect } from "react";
import { API } from "../api"; // your custom API wrapper
import { useNavigate } from "react-router-dom";

const CreateContest = () => {
  const [name, setName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [problems, setProblems] = useState([]);
  const [selectedProblems, setSelectedProblems] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const res = await API.get("api/problems");
        setProblems(res.data);
      } catch (err) {
        console.error("Failed to fetch problems", err);
      }
    };
    fetchProblems();
  }, []);

  const handleCheckboxChange = (id) => {
    setSelectedProblems((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("api/contests/create", {
        name,
        startTime,
        endTime,
        problemIds: selectedProblems,
      });
      alert("Contest created!");
      setName("");
      setStartTime("");
      setEndTime("");
      setSelectedProblems([]);
      navigate("/contests");
    } catch (err) {
      console.error("Error creating contest", err);
      alert("Failed to create contest");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h2>Create Contest</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Contest Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ margin: "10px 0", padding: "8px", width: "100%" }}
        />
        <input
          type="datetime-local"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          required
          style={{ margin: "10px 0", padding: "8px", width: "100%" }}
        />
        <input
          type="datetime-local"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          required
          style={{ margin: "10px 0", padding: "8px", width: "100%" }}
        />

        <h4>Select Problems</h4>
        <div style={{ maxHeight: "200px", overflowY: "auto", border: "1px solid #ccc", padding: "10px" }}>
          {problems.length === 0 ? (
            <p>No problems available</p>
          ) : (
            problems.map((problem) => (
              <div key={problem._id}>
                <label>
                  <input
                    type="checkbox"
                    checked={selectedProblems.includes(problem._id)}
                    onChange={() => handleCheckboxChange(problem._id)}
                  />
                  {problem.title}
                </label>
              </div>
            ))
          )}
        </div>

        <button type="submit" style={{ marginTop: "15px", padding: "10px 20px" }}>
          Create Contest
        </button>
      </form>
    </div>
  );
};

export default CreateContest;
