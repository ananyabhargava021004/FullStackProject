import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API } from "../api";
import "../App.css";

const Login = () => {
  // Local state for form inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Hook to navigate programmatically
  const navigate = useNavigate();

  // Function runs when form is submitted
  const handleLogin = async (e) => { 
    e.preventDefault();
    try {
      // POST request to /login API endpoint
      const res = await API.post("/api/auth/login", { email, password });
      // If login successful
      if (res.data.success) {
        // Save JWT token to localStorage
        localStorage.setItem("token", res.data.token);
        alert("Login successful!");
        navigate("/");
      }
    } catch (err) {
      // If login failed, show error message
      console.error("Login error:", err);
      alert(err.response?.data?.message || "Invalid email or password.");
    }
  };

  return (
    <div className="page-center">
      <div className="form-card">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Update state on change
          />
          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Update state on change
          />
          <button type="submit">Login</button>
        </form>
        <div className="switch-link">
          Don't have an account? <Link to="/signup">Signup</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
