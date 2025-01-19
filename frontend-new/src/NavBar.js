import React from 'react';
import './NavBar.css';
import logo from './logo.png'; // necessary?
import three_lines from './three_lines.svg';

const NavBar = ({ onLoginClick, onToggleSidebar }) => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src={three_lines} className="navbar-logo-img" alt="check_chat_history" onClick={onToggleSidebar} />
        <img src={logo} className="navbar-logo-img" alt="logo" />
      </div>
      <ul className="navbar-links">
        <li><a href="#about">About</a></li>
        <li><a href="#chat">Save, Close & Start New Chat</a></li>
        <li><a onClick={onLoginClick}>Login/Register</a></li>
      </ul>
    </nav>
  );
}

export default NavBar;
