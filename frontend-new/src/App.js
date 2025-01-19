import React, {useState} from 'react'
import ScrollTriggered from './ScrollTriggered'
import NavBar from './NavBar';
import './App.css';
import LoginRegisterWindow from './LoginRegisterWindow';
import About from './About';


function App() {
  const [showLoginWindow, setShowLoginWindow] = useState(false);
  const [showAboutWindow, setShowAboutWindow] = useState(true);
  const toggleLoginWindow = (e) => {
    e.preventDefault(); // Prevent the default anchor link behavior
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
  
  return (
    <div className="App">
      <NavBar onLoginClick={toggleLoginWindow} onAboutClick={toggleAboutWindow} />
      <ScrollTriggered />
      {showLoginWindow && <LoginRegisterWindow onClose={closeLoginWindow} />}
      {showAboutWindow && <About onClose={closeAboutWindow} />}
    </div>
  )
}

export default App