import React, {useState} from 'react'
import ScrollTriggered from './ScrollTriggered'
import ExtensionWrapper from './ExtensionWrapper';
import NavBar from './NavBar';
import './App.css';
import LoginRegisterWindow from './LoginRegisterWindow';


function App() {
  const [showLoginWindow, setShowLoginWindow] = useState(false);
  
  const isExtension = window.chrome && window.chrome.runtime && window.chrome.runtime.id;

  const toggleLoginWindow = (e) => {
    e.preventDefault();
    setShowLoginWindow(!showLoginWindow);
  };

  const closeLoginWindow = () => {
    setShowLoginWindow(false);
  };

  if (isExtension) {
    return (
      <div className="App">
        <ExtensionWrapper>
          <ScrollTriggered />
        </ExtensionWrapper>
      </div>
    );
  }

  return (
    <div className="App">
      <NavBar onLoginClick={toggleLoginWindow} />
      <ScrollTriggered />
      {showLoginWindow && <LoginRegisterWindow onClose={closeLoginWindow} />}
    </div>
  );
}

export default App;