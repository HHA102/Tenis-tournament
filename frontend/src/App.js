import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import AdminDashboard from "./Components/Dashboard/AdminDashboard";
import OrganizerDashboard from "./Components/Dashboard/OrganizerDashboard";
import PlayerDashboard from "./Components/Dashboard/PlayerDashboard";
import RefereeDashboard from "./Components/Dashboard/RefereeDashboard";
import SponsorDashboard from "./Components/Dashboard/SponsorDashboard";
import UserDashboard from "./Components/Dashboard/UserDashboard";
import HomePage from "./Components/Home/HomePage";
import Login from "./Components/Login/Login";
import NavBar from "./Components/NavBar/NavBar";
import Register from "./Components/Register/Register";
import ApplicationsManagement from "./pages/ApplicationsManagement";
import DrawerMenuLayout from "./Components/Layout/Drawer";
import CourtsManagement from "./pages/CourtsManagement";
function App() {
  return (
    <Router>
      <NavBar />
      <div className="App">
        <DrawerMenuLayout >
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
            <Route path="/applications" element={<ApplicationsManagement />} />
            <Route path="/courts" element={<CourtsManagement />} />
          </Routes>
        </DrawerMenuLayout>
      </div>
    </Router>
  );
}

export default App;
