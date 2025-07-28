import React, { useEffect, useState } from "react";
import { API } from "../api";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const token = localStorage.getItem("token");
let role = null;
if (token) {
  const decoded = jwtDecode(token);
  role = decoded.role;
}
const ContestList = () => {
  const [contests, setContests] = useState([]);

  useEffect(() => {
    const fetchContests = async () => {
      const res = await API.get("api/contests");
      setContests(res.data);
    };
    fetchContests();
  }, []);

  return (
    <div>
      <h2>All Contests</h2>
      <ul>
        {contests.map((contest) => (
          <li key={contest._id}>
            <Link to={`/contests/${contest._id}`}>
              {contest.name} (
              {contest.startTime
                ? `${new Date(contest.startTime).toLocaleString()} to ${new Date(contest.endTime).toLocaleString()}`
                : "Date unavailable"}
              )
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContestList;
