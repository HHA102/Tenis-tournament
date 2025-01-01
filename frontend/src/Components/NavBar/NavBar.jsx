import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import "./navbar.css";
import { logOut } from "../../redux/apiRequest";
import { createAxios } from "../../createInstance";
import { logOutSuccess } from "../../redux/authSlice";
const NavBar = () => {
  const user = useSelector((state) => state.auth.login.currentUser);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  let axiosJWT = createAxios(user, dispatch, logOutSuccess);
  const accessToken = user?.accessToken;
  const id = user?._id;
  const handleLogout = () => {
    logOut(dispatch, id, navigate, accessToken, axiosJWT);
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
      {/* Logo nằm bên trái */}
      <div className="navbar-logo">Tennis Tournament</div>

      {/* Menu nằm bên phải */}
      <div className="navbar-menu">
        <Link to={getHomeLink()} className="navbar-home">
          Home
        </Link>

        {/* Kiểm tra nếu đã đăng nhập */}
        {user ? (
          <>
            <p className="navbar-user">
              Hi, <span>{user.username}</span>
            </p>
            <Link to="/logout" className="navbar-logout" onClick={handleLogout}>
              Log out
            </Link>
          </>
        ) : (
          <>
            <Link to="/login" className="navbar-login">
              Login
            </Link>
            <Link to="/register" className="navbar-register">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
