// EditContest.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API } from "../api";

const EditContest = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contest, setContest] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchContest = async () => {
      const { data } = await API.get(`/api/contests/${id}`);
      setContest(data);
    };
    fetchContest();
  }, [id]);

  const handleChange = (e) => {
    setContest({ ...contest, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/api/contests/${id}`, contest, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setMessage("Contest updated successfully.");
      setTimeout(() => navigate(`/contests/${id}`), 1500);
    } catch (error) {
      console.error(error);
      setMessage("Failed to update contest.");
    }
  };

  if (!contest) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Edit Contest</h2>
      {message && <p style={{ color: "green", fontWeight: "bold" }}>{message}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input name="name" value={contest.name} onChange={handleChange} required />
        </label>
        <br />
        <label>
          Start Time:
          <input type="datetime-local" name="startTime" value={contest.startTime.slice(0, 16)} onChange={handleChange} />
        </label>
        <br />
        <label>
          End Time:
          <input type="datetime-local" name="endTime" value={contest.endTime.slice(0, 16)} onChange={handleChange} />
        </label>
        <br />
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default EditContest;
