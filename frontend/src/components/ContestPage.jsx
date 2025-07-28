import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { API } from "../api";
import { jwtDecode } from "jwt-decode";

const ContestPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contest, setContest] = useState(null);
  const [timeLeft, setTimeLeft] = useState("");
  const [submissions, setSubmissions] = useState([]);
  const [role, setRole] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setRole(decoded.role);
    }
  }, []);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const { data: contestData } = await API.get(`/api/contests/${id}`);
        setContest(contestData);
        const res = await API.get(`/api/submissions/contest/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        setSubmissions(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAll();
  }, [id]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!contest) return;
      const now = new Date();
      const start = new Date(contest.startTime);
      const end = new Date(contest.endTime);
      if (now < start) setTimeLeft(`Starts in ${Math.floor((start - now) / 60000)}m`);
      else if (now > end) {
        setTimeLeft("Contest Ended");
        clearInterval(interval);
      } else {
        const diff = end - now;
        const m = Math.floor(diff / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        setTimeLeft(`${m}m ${s}s`);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [contest]);

  const handleDelete = async () => {
    if (!window.confirm("Confirm deletion?")) return;
    try {
      await API.delete(`/api/contests/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setMessage("Contest deleted successfully.");
      setTimeout(() => navigate("/contests"), 1500);
    } catch {
      setMessage("Error deleting contest.");
    }
  };

  if (!contest) return <p>Loading...</p>;

  const contestStarted = new Date() >= new Date(contest.startTime);

  const getStatusIcon = (pid) => {
    const sub = submissions.find(s => {
      const sid = s.problem?._id || s.problem;
      return sid === pid;
    });
    if (!sub) return <span title="Not attempted" style={{ color: "gray" }}>⚪</span>;
    if (sub.verdict === "Accepted") return <span title="Accepted" style={{ color: "green" }}>✔</span>;
    return <span title={sub.verdict} style={{ color: "red" }}>✗</span>;
  };

  return (
    <div style={{ padding: 20, position: "relative" }}>
      {message && <p style={{ color: "green", fontWeight: "bold" }}>{message}</p>}
      <h2>{contest.name}</h2>
      {timeLeft && <div style={{ position: "absolute", top: 20, right: 20, fontWeight: "bold" }}>{timeLeft}</div>}
      <p><strong>Start:</strong> {new Date(contest.startTime).toLocaleString()}</p>
      <p><strong>End:</strong> {new Date(contest.endTime).toLocaleString()}</p>

      {role === "admin" && (
        <div style={{ marginBottom: 10 }}>
          <Link to={`/contests/${id}/edit`} style={{ marginRight: 10 }}>🖋️ Edit</Link>
          <button onClick={handleDelete} style={{ color: "red" }}>🗑️ Delete</button>
        </div>
      )}

      <h3>Problems</h3>
      {!contestStarted
        ? <p style={{ color: "gray" }}>Problems visible after contest starts.</p>
        : <ul>
            {contest.problems.map((p, idx) => (
              <li key={p._id} style={{ marginBottom: 8 }}>
                <Link to={`/problems/${p._id}`}>{idx + 1}. {p.title}</Link>
                <span style={{ marginLeft: 10 }}>{getStatusIcon(p._id)}</span>
              </li>
            ))}
          </ul>
      }
    </div>
  );
};

export default ContestPage;
