import React, { useEffect, useState } from "react";
import { API } from "../api";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Contests = () => {
  const [contests, setContests] = useState([]);
  const [error, setError] = useState("");
  const [solvedContests, setSolvedContests] = useState([]);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  let role = null, userId = null;

  if (token) {
    const decoded = jwtDecode(token);
    role = decoded.role;
    userId = decoded.id;
  }

  useEffect(() => {
    fetchContests();
    if (userId) fetchUserSubmissions();
  }, []);

  const fetchContests = async () => {
    try {
      const res = await API.get("/api/contests/");
      setContests(res.data);
    } catch (err) {
      setError("Failed to fetch contests");
    }
  };

  const fetchUserSubmissions = async () => {
    try {
      const res = await API.get("/api/submissions/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const submissions = res.data;
      const solved = new Set();

      for (let sub of submissions) {
        if (sub.verdict === "Accepted" && sub.problem.contest) {
          solved.add(sub.problem.contest);
        }
      }

      setSolvedContests([...solved]);
    } catch (err) {
      console.error("Error fetching user submissions", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this contest?")) return;
    try {
      await API.delete(`/api/contests/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Contest deleted successfully");
      fetchContests();
    } catch (err) {
      alert("Failed to delete contest");
    }
  };

  const getStatus = (start, end) => {
    const now = new Date();
    const s = new Date(start);
    const e = new Date(end);
    if (now < s) return "Upcoming";
    else if (now > e) return "Ended";
    else return "Ongoing";
  };

  return (
    <div>
      <h2 style={{ marginBottom: "20px" }}>All Contests</h2>

      {role === "admin" && (
        <button
          onClick={() => navigate("/contests/create")}
          style={{
            padding: "10px 14px",
            backgroundColor: "#3498db",
            color: "white",
            border: "none",
            borderRadius: "5px",
            marginBottom: "20px",
            cursor: "pointer",
          }}
        >
          Create Contest
        </button>
      )}

      {error && <p>{error}</p>}

      {contests.length === 0 ? (
        <p>No contests available.</p>
      ) : (
        <ul>
          {contests.map((contest) => (
            <li key={contest._id} style={{ marginBottom: "20px" }}>
              <Link to={`/contests/${contest._id}`}>
                <strong>
                  {contest.name}{" "}
                  {solvedContests.includes(contest._id) && (
                    <span style={{ color: "green", marginLeft: "5px" }}>✔️</span>
                  )}
                </strong>
              </Link>
              <p>
                <strong>Date:</strong>{" "}
                {contest.startTime && contest.endTime
                  ? `${new Date(contest.startTime).toLocaleString()} to ${new Date(
                      contest.endTime
                    ).toLocaleString()}`
                  : "N/A"}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                {contest.startTime && contest.endTime
                  ? getStatus(contest.startTime, contest.endTime)
                  : "Unknown"}
              </p>

              {role === "admin" && (
                <div style={{ marginTop: "8px" }}>
                <Link
                  to={`/contests/${contest._id}/edit`}
                  style={{
                    marginRight: "10px",
                    padding: "6px 12px",
                    backgroundColor: "#1a7d43ff", // green
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    textDecoration: "none",
                    fontSize: "14px",
                  }}
                > Edit
                </Link>
                <button
                  onClick={() => handleDelete(contest._id)}
                  style={{
                    padding: "6px 12px",
                    backgroundColor: "#cb3524ff", // red
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                > Delete
                </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Contests;
