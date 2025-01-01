import "./App.css";
import HomePage from "./Components/Home/HomePage";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Components/Login/Login";
import Register from "./Components/Register/Register";
import NavBar from "./Components/NavBar/NavBar";
import { useState } from "react";
import AdminDashboard from "./Components/Dashboard/AdminDashboard";
import PlayerDashboard from "./Components/Dashboard/PlayerDashboard";
import UserDashboard from "./Components/Dashboard/UserDashboard";
import SponsorDashboard from "./Components/Dashboard/SponsorDashboard";
import OrganizerDashboard from "./Components/Dashboard/OrganizerDashboard";
import RefereeDashboard from "./Components/Dashboard/RefereeDashboard";
function App() {
  return (
    <Router>
      <NavBar />
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/player-dashboard" element={<PlayerDashboard />} />
          <Route path="/sponsor-dashboard" element={<SponsorDashboard />} />
          <Route path="/organizer-dashboard" element={<OrganizerDashboard />} />
          <Route path="/referee-dashboard" element={<RefereeDashboard />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
