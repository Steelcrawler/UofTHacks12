import React from 'react';
import './SideBar.css';

const SideBar = ({ isOpen, onClose }) => {
  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>  {/* Apply 'open' class when isOpen is true */}
      <div className="sidebar-content">
        <h3>Chat History</h3>
        <ul id="chat-history">
          <li>Chat 1: Hello</li>
          <li>Chat 2: How are you?</li>
          <li>Chat 3: Goodbye</li>
        </ul>
      </div>
      <button className="close-btn" onClick={onClose}>Close</button>
    </div>
  );
};

export default SideBar;
