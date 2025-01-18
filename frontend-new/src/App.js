import React from 'react'
import ScrollTriggered from './ScrollTriggered'
import NavBar from './NavBar';
import MotionButton from './motion-button';


function App() {
  return (
    <div className="App">
      <NavBar />
      <MotionButton />
      <ScrollTriggered />
      
    </div>
  )
}

export default App