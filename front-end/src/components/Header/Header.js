import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <h1>Tennis Tournament</h1>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/create-tournament">Create Tournament</Link></li>
        </ul>
      </nav>
      <div className="auth-buttons">
        <Link to="/login" className="btn">Login</Link>
        <Link to="/register" className="btn btn-primary">Register</Link>
      </div>
    </header>
  );
};

export default Header;
