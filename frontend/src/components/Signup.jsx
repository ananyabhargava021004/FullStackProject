import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API } from "../api";
import "../App.css";

const Signup = () => {
  // Local state to hold form inputs
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Hook to redirect user programmatically
  const navigate = useNavigate();

  // Function runs when form is submitted
  const handleSignup = async (e) => {
    e.preventDefault(); // Prevent default form reload behavior

    try {
      // Make POST request to /signup API endpoint
      const res = await API.post("/api/auth/signup", {
        firstname,
        lastname,
        email,
        password
      });

      // If signup is successful
      if (res.data.success) {
        // Save token to localStorage for later requests
        localStorage.setItem("token", res.data.token);
        alert("Signup successful!");
        navigate("/");
      }
    } catch (err) {
      // If signup failed, show error message
      console.error("Signup error:", err);
      alert(err.response?.data?.message || "Signup failed.");
    }
  };

  return (
    <div className="page-center">
      <div className="form-card">
        <h2>Signup</h2>
        <form onSubmit={handleSignup}>
          {/* Controlled inputs connected to state */}
          <input
            type="text"
            placeholder="First Name"
            required
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
          />
          <input
            type="text"
            placeholder="Last Name"
            required
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">Sign Up</button>
        </form>
        <div className="switch-link">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;