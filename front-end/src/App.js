import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminPage';
import OrganizerDashboard from './pages/OrganizerPage';
import RefereeDashboard from './pages/RefereePage';
import SponsorDashboard from './pages/SponsorPage';
import PlayerDashboard from './pages/HomePage';
import HomePage from './pages/HomePage';
import CreateTournament from './components/CreateTournament';

const App = () => {
  const [user, setUser] = useState(null); // Lưu thông tin người dùng sau khi đăng nhập

  // Giả lập API để lấy thông tin người dùng (thay thế bằng API thực tế)
  useEffect(() => {
    const fetchUser = async () => {
      // Replace this with actual API call to fetch logged-in user info
      const loggedInUser = {
        isAuthenticated: true,
        role: 'player', // Replace with dynamic data: 'admin', 'organizer', etc.
      };
      setUser(loggedInUser);
    };

    fetchUser();
  }, []);

  return (
    <Router>
      <Header />
      <main>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Role-based routes */}
          <Route
            path="/dashboard"
            element={
              user?.isAuthenticated ? (
                user.role === 'admin' ? (
                  <AdminDashboard />
                ) : user.role === 'organizer' ? (
                  <OrganizerDashboard />
                ) : user.role === 'referee' ? (
                  <RefereeDashboard />
                ) : user.role === 'sponsor' ? (
                  <SponsorDashboard />
                ) : (
                  <PlayerDashboard />
                )
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* Additional routes */}
          <Route
            path="/create-tournament"
            element={
              user?.isAuthenticated && user.role === 'organizer' ? (
                <CreateTournament />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
};

export default App;
