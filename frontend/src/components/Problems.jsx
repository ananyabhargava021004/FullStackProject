import React, { useEffect, useState } from 'react';
import { API } from "../api";
import { Link, useNavigate } from "react-router-dom"; 
import { jwtDecode } from "jwt-decode"; 

function Problems() {
  const [problems, setProblems] = useState([]);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [sortBy, setSortBy] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  let role = null;
  if (token) {
    const decoded = jwtDecode(token);
    role = decoded.role;
  }

  useEffect(() => {
    fetchProblems();
  }, [search, tagFilter, difficultyFilter, sortBy]);

  const fetchProblems = async () => {
    try {
      const res = await API.get('/api/problems/', {
        params: {
          search,
          tags: tagFilter,
          difficulty: difficultyFilter,
        }
      });

      let sortedData = res.data;
      if (sortBy === "Difficulty") {
        const order = { "Easy": 1, "Medium": 2, "Hard": 3 };
        sortedData.sort((a, b) => order[a.difficulty] - order[b.difficulty]);
      } else if (sortBy === "Quality") {
        sortedData.sort((a, b) => (b.aiQuality || 0) - (a.aiQuality || 0));
      }

      setProblems(sortedData);
    } catch (err) {
      setError('Failed to fetch problems');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this problem?")) return;

    try {
      await API.delete(`/api/problems/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Problem deleted successfully!");
      fetchProblems();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete problem");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>All Problems</h2>
        {role === "admin" && (
          <button
            onClick={() => navigate("/problems/create")}
            style={{
              padding: "8px 14px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Create Problem
          </button>
        )}
      </div>

      <div style={{ display: "flex", gap: "10px", margin: "20px 0", flexWrap: "wrap" }}>
        <input
          type="text"
          placeholder="Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: "6px 8px", borderRadius: "4px", border: "1px solid #ccc" }}
        />
        <input
          type="text"
          placeholder="Filter by tags (comma separated)"
          value={tagFilter}
          onChange={(e) => setTagFilter(e.target.value)}
          style={{ padding: "6px 8px", borderRadius: "4px", border: "1px solid #ccc" }}
        />
        <select
          value={difficultyFilter}
          onChange={(e) => setDifficultyFilter(e.target.value)}
          style={{ padding: "6px 8px", borderRadius: "4px", border: "1px solid #ccc" }}
        >
          <option value="">All Difficulties</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{ padding: "6px 8px", borderRadius: "4px", border: "1px solid #ccc", marginLeft: "auto" }}
        >
          <option value="">Sort By</option>
          <option value="Difficulty">Difficulty</option>
          <option value="Quality">AI Quality</option>
        </select>
      </div>

      {error && <p>{error}</p>}

      {problems.length === 0 ? (
        <p>No problems available for the selected filters.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#f2f2f2" }}>
              <th style={thStyle}>Question</th>
              <th style={thStyle}>Tags</th>
              <th style={thStyle}>Difficulty</th>
              <th style={thStyle}>AI Quality</th>
              {role === "admin" && <th style={thStyle}>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {problems.map(problem => (
              <tr key={problem._id} style={{ borderBottom: "1px solid #ddd" }}>
                <td style={tdStyle}>
                  <Link to={`/problems/${problem._id}`} style={{ textDecoration: "none", color: "#007bff" }}>
                    {problem.title}
                  </Link>
                </td>
                <td style={tdStyle}>{problem.tags.join(', ')}</td>
                <td style={tdStyle}>{problem.difficulty}</td>
                <td style={tdStyle}>{problem.aiQuality ? problem.aiQuality.toFixed(1) : "Not Rated"}</td>
                {role === "admin" && (
                  <td style={tdStyle}>
                    <Link to={`/problems/edit/${problem._id}`}>
                      <button style={btnStyle}>Edit</button>
                    </Link>
                    <button onClick={() => handleDelete(problem._id)} style={{ ...btnStyle, backgroundColor: "#dc3545" }}>
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const thStyle = {
  padding: "10px",
  border: "1px solid #ddd",
  textAlign: "left"
};

const tdStyle = {
  padding: "10px",
  border: "1px solid #ddd",
};

const btnStyle = {
  padding: "6px 10px",
  marginRight: "5px",
  backgroundColor: "#28a745",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer"
};

export default Problems;
