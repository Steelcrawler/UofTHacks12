import React, { useState } from 'react';
import ScrollTriggered from './ScrollTriggered'
import NavBar from './NavBar';
import './App.css';
import LoginRegisterWindow from './LoginRegisterWindow';
import SideBar from './SideBar';


function App() {
  const [showLoginWindow, setShowLoginWindow] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleLoginWindow = (e) => {
    e.preventDefault(); // Prevent the default anchor link behavior
    setShowLoginWindow(!showLoginWindow);
  };

  const closeLoginWindow = () => {
    setShowLoginWindow(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);  // Toggle the sidebar state
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);  // Close the sidebar
  };
  
  return (
    <div className="App">
      <NavBar onLoginClick={toggleLoginWindow} onToggleSidebar={toggleSidebar} />
      <ScrollTriggered />
      {showLoginWindow && <LoginRegisterWindow onClose={closeLoginWindow} />}
      {isSidebarOpen && <SideBar isOpen={isSidebarOpen} onClose={closeSidebar} />}
    </div>
  )
}

export default App