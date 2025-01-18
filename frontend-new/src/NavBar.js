import React from 'react';
import './NavBar.css';
import logo from './logo.png'; // necessary?

const NavBar = ({ onLoginClick }) => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src={logo} className="navbar-logo-img" alt="logo" />
      </div>
      <ul className="navbar-links">
        <li><a href="#about">About</a></li>
        <li><a href="#chat">Chat</a></li>
        <li><a onClick={onLoginClick}>Login/Register</a></li>
      </ul>
    </nav>
  );
}

export default NavBar;
