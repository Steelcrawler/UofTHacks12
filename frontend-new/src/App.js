import React, { useState, useEffect } from 'react';
import ScrollTriggered from './ScrollTriggered'
import NavBar from './NavBar';
import './App.css';
import LoginRegisterWindow from './LoginRegisterWindow';
import SideBar from './SideBar';
import axios from 'axios';


function App() {
  const [showLoginWindow, setShowLoginWindow] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/api/check_session', { withCredentials: true });
      if (response.data.logged_in) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.error('Error checking session:', error);
    }
  }

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

  const handleLogout = async () => {
    alert("Your messages will not be saved after looging out.");
    try {
      await axios.post('http://127.0.0.1:5000/api/logout', {}, { withCredentials: true });
      setUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleStartNewChat = async () => {
    if (user === null) {
      alert("You're not logged in, and your chat is not saved.");
    }
    // ... create new chat api
  }
  
  return (
    <div className="App">
      <NavBar onLoginClick={toggleLoginWindow} onToggleSidebar={toggleSidebar} user={user} onLogout={handleLogout} onStartNewChat={handleStartNewChat} />
      <ScrollTriggered user={user} />
      {showLoginWindow && <LoginRegisterWindow onLoginSuccess={setUser} onClose={closeLoginWindow} />}
      {isSidebarOpen && <SideBar isOpen={isSidebarOpen} onClose={closeSidebar} />}
    </div>
  )
}

export default App