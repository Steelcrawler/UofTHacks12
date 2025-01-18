import React, {useState} from 'react'
import ScrollTriggered from './ScrollTriggered'
import NavBar from './NavBar';
import './App.css';
import LoginRegisterWindow from './LoginRegisterWindow';


function App() {
  const [showLoginWindow, setShowLoginWindow] = useState(false);
  const toggleLoginWindow = (e) => {
    e.preventDefault(); // Prevent the default anchor link behavior
    setShowLoginWindow(!showLoginWindow);
  };

  const closeLoginWindow = () => {
    setShowLoginWindow(false);
  };
  
  return (
    <div className="App">
      <NavBar onLoginClick={toggleLoginWindow} />
      <ScrollTriggered />
      {showLoginWindow && <LoginRegisterWindow onClose={closeLoginWindow} />}
    </div>
  )
}

export default App