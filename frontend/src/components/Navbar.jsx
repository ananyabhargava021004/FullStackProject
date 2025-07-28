import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "./ThemeContext"; 
import { jwtDecode } from "jwt-decode";
import { API } from "../api";
import "../App.css";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const { theme, toggleTheme } = useTheme();

  const fetchUser = async () => {
    if (!token) return;
    try {
      const res = await API.get("/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setUser(res.data.user);
      }
    } catch (err) {
      console.error("User fetch error:", err);
    }
  };

  const handleLogout = async () => {
    await API.get("/api/auth/logout");
    localStorage.removeItem("token");
    alert("Logged out");
    window.location.reload();
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <nav className="top-navbar">
      <div className="top-navbar-left">
        <Link to="/">CodeHub </Link>
        <Link to="/problems">Problems </Link>
        <Link to="/contests">Contests</Link>
      </div>
      <div className="top-navbar-right">
        <button onClick={toggleTheme} className="theme-toggle" style={{marginRight: "8px"}}>
          {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
        </button>
        {!token ? (
          <>
            <Link to="/signup">Signup</Link>
            <Link to="/login">Login</Link>
          </>
        ) : (
          <div className="profile-dropdown">
            <button className="profile-button">My Profile ▼</button>
            <div className="profile-menu">
              <p><strong>{user?.firstname} {user?.lastname}</strong></p>
              {user?.email && <p>Email: {user.email}</p>}
              {typeof user?.problemsSolved === "number" && <p>Problems Solved: {user.problemsSolved}</p>}
              {typeof user?.rating === "number" && <p>Rating: {user.rating}</p>}
              <button onClick={handleLogout}>Logout</button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
