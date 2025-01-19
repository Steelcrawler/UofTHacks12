import React, { useState, useEffect } from 'react';
// import { GoogleOAuthProvider } from '@react-oauth/google';
import ScrollTriggered from './ScrollTriggered';
import NavBar from './NavBar';
import './App.css';
import LoginRegisterWindow from './LoginRegisterWindow';

import About from './About';

import SideBar from './SideBar';
import axios from 'axios';


// const GOOGLE_CLIENT_ID = "711241449544-os41uo4q7u566gfq2hs577sof224tost.apps.googleusercontent.com";

function App() {
  const [showLoginWindow, setShowLoginWindow] = useState(false);

  const [showAboutWindow, setShowAboutWindow] = useState(true);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const response = await axios.get('/api/check_session');
      if (response.data.logged_in) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.error('Error checking session:', error);
    }
  }


  const toggleLoginWindow = (e) => {
    if (e) e.preventDefault();
    setShowLoginWindow(!showLoginWindow);
  };

  const closeLoginWindow = () => {
    setShowLoginWindow(false);
  };


  const toggleAboutWindow = (e) => {
    e.preventDefault(); // Prevent the default anchor link behavior
    setShowAboutWindow(!showAboutWindow);
  };

  const closeAboutWindow = () => {
    setShowAboutWindow(false);
  };
       
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleLogout = async () => {
    try {
      await axios.post('/api/logout');
      setUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
  
  return (
    // <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="App">
        <NavBar 
          onLoginClick={toggleLoginWindow} 
          onAboutClick={toggleAboutWindow}
          onToggleSidebar={toggleSidebar} 
          user={user} 
          onLogout={handleLogout}
        />
        
        <main className="main-content">
          <ScrollTriggered 
            user={user} 
          />
          
          {showLoginWindow && (
            <LoginRegisterWindow 
              onLoginSuccess={setUser}
              onClose={closeLoginWindow} 
            />
          )}
          
          {isSidebarOpen && (
            <SideBar 
              isOpen={isSidebarOpen} 
              onClose={closeSidebar} 
            />
          )}
          {showAboutWindow && <About onClose={closeAboutWindow} />}
        </main>
      </div>
    // </GoogleOAuthProvider>
  );

}

export default App;