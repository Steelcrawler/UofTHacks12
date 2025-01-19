import React, { useState } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import ScrollTriggered from './ScrollTriggered';
import NavBar from './NavBar';
import './App.css';
import LoginRegisterWindow from './LoginRegisterWindow';
import SideBar from './SideBar';

const GOOGLE_CLIENT_ID = "711241449544-os41uo4q7u566gfq2hs577sof224tost.apps.googleusercontent.com";

function App() {
  const [showLoginWindow, setShowLoginWindow] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleLoginWindow = (e) => {
    if (e) e.preventDefault();
    setShowLoginWindow(!showLoginWindow);
  };

  const closeLoginWindow = () => {
    setShowLoginWindow(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };
  
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="App">
        <NavBar 
          onLoginClick={toggleLoginWindow} 
          onToggleSidebar={toggleSidebar} 
        />
        
        <main className="main-content">
          <ScrollTriggered />
          
          {showLoginWindow && (
            <LoginRegisterWindow 
              onClose={closeLoginWindow} 
            />
          )}
          
          {isSidebarOpen && (
            <SideBar 
              isOpen={isSidebarOpen} 
              onClose={closeSidebar} 
            />
          )}
        </main>
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;