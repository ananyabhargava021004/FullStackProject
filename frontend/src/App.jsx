import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Home from "./components/Home";
import Problems from "./components/Problems";
import SubmitSolution from "./components/SubmitSolution";
import CreateProblem from "./components/CreateProblem";
import EditProblem from "./components/EditProblem";
import ProblemDetail from './components/ProblemDetail';
import Compiler from "./components/Compiler";
import Contests from "./components/Contests";
import ContestList from "./components/ContestList";
import ContestPage from "./components/ContestPage";
import CreateContest from "./components/CreateContest";
import EditContest from './components/EditContest';
import { ThemeProvider } from "./components/ThemeContext";
import "./App.css";

function App() {
  return (
    <ThemeProvider>
    <BrowserRouter>
      <div className="app-layout">
        <Navbar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/problems" element={<Problems />} />
            <Route path="/problems/create" element={<CreateProblem />} />
            <Route path="/problems/edit/:id" element={<EditProblem />} />
            <Route path="/problems/:id" element={<ProblemDetail />} />
            <Route path="/submit" element={<SubmitSolution />} />
            <Route path="/compiler" element={<Compiler />} />
            <Route path="/contests" element={<Contests />} />
            <Route path="/contests/:id" element={<ContestPage />} />
            <Route path="/contests/create" element={<CreateContest />} />
            <Route path="/contests/:id/edit" element={<EditContest />} />
            <Route path="*" element={<h2 style={{textAlign: "center"}}>404 | Page Not Found</h2>} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
