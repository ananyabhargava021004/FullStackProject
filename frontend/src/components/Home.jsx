import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

const Home = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  let role = null;
  if (token) {
    const decoded = jwtDecode(token);
    role = decoded.role;
  }

  const handleStartCoding = () => {
    if (!token) navigate("/login");
    else navigate("/problems");
  };

  return (
    <div className="dashboard-container">
      <h1>Master Your Coding Journey!</h1>
      <p style={{ margin: "15px 0 30px" }}>Sharpen your skills, take challenges, and compete!</p>

      <button className="start-button" onClick={handleStartCoding}>
        {token ? "Happy Coding 🚀" : "Start Coding Now"}
      </button>

      <div className="profile-stats" style={{ marginTop: "50px" }}>
        <div className="stat-card">
          <h3>Total Problems</h3>
          <p>120+</p>
        </div>
        <div className="stat-card">
          <h3>Active Users</h3>
          <p>100+</p>
        </div>
        <div className="stat-card">
          <h3>Submissions</h3>
          <p>500+</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
