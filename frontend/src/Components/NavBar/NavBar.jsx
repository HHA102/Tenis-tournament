import MenuIcon from '@mui/icons-material/Menu';
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logOut } from "../../redux/apiRequest";
import eventEmitter from "../../utils/eventEmitter";
import "./navbar.css";
const NavBar = () => {
  const user = useSelector((state) => state.auth.login.currentUser);

  const navigate = useNavigate();
  const handleLogout = () => {
    logOut(navigate);
  };
  const getHomeLink = () => {
    if (!user) return "/";
    switch (user.role[0]) {
      case "admin":
        return "/admin-dashboard";
      case "player":
        return "/player-dashboard";
      case "sponsor":
        return "/sponsor-dashboard";
      case "organizer":
        return "/organizer-dashboard";
      case "referee":
        return "/referee-dashboard";
      default:
        return "/user-dashboard";
    }
  };
  return (
    // <nav className="navbar-container">
    //   <div class="navbar-logo">Tennis Tournament</div>
    //   <div class="navbar-menu"></div>
    //   <Link to={getHomeLink()} className="navbar-home">
    //     {" "}
    //     Home{" "}
    //   </Link>
    //   {user ? (
    //     <>
    //       <p className="navbar-user">
    //         Hi, <span> {user.username} </span>{" "}
    //       </p>
    //       <Link to="/logout" className="navbar-logout" onClick={handleLogout}>
    //         {" "}
    //         Log out
    //       </Link>
    //     </>
    //   ) : (
    //     <>
    //       <Link to="/login" className="navbar-login">
    //         {" "}
    //         Login{" "}
    //       </Link>
    //       <Link to="/register" className="navbar-register">
    //         {" "}
    //         Register
    //       </Link>
    //     </>
    //   )}
    // </nav>
    <nav className="navbar-container">
      <div className="cursor-pointer" onClick={() => {
        // send event emitter
        eventEmitter.emit("openDrawer");
      }}>
        <MenuIcon htmlColor="#fff" />
      </div>
      {/* Logo on the left */}
      <div className="navbar-logo">
        🎾 Tennis Tournament
      </div>

      {/* Menu on the right */}
      <div className="navbar-menu">
        <Link to={getHomeLink()} className="navbar-link">
          Home
        </Link>

        {/* If logged in */}
        {user ? (
          <>
            <p className="navbar-user">
              👋 Hi, <span className="navbar-username">{user.username}</span>
            </p>
            <Link to="/logout" className="navbar-button" onClick={handleLogout}>
              Log out
            </Link>
          </>
        ) : (
          <>
            <Link to="/login" className="navbar-button">
              Login
            </Link>
            <Link to="/register" className="navbar-button register">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
