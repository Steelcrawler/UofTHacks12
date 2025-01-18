import React from 'react';
import './NavBar.css';
import logo from './logo.png'; // necessary?

function NavBar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src={logo} className="navbar-logo-img" alt="logo" />
      </div>
      <ul className="navbar-links">
        <li><a href="#about">About</a></li>
        <li><a href="#chat">Chat</a></li>
      </ul>
    </nav>
  );
}

export default NavBar;
