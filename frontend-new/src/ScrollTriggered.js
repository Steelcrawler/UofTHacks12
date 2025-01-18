import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion'
import logo from './logo.svg';
import background from './background.png';
function SkeletonCard() {
  return (
    <motion.div
      style={cardContainer}
      initial="offscreen"
      animate="onscreen"
      viewport={{ amount: 0.8 }}
    >
      <div>
        <motion.div 
          style={iconWhite}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="w-20 h-20 rounded-full"
            style={{ background: '#d1d5db' }}  // Changed to gray-300
            animate={{
              opacity: [0.7, 1, 0.7],
              scale: [0.98, 1, 0.98]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
      </div>

      <motion.div 
        style={{
          ...card,
          background: '#e5e7eb',  // Changed to gray-200
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '2rem',
          padding: '2rem'
        }}
        variants={cardVariants}
      >
        <motion.div 
          className="h-16 w-48 rounded-lg"
          style={{ background: '#9ca3af' }}  // Changed to gray-400
          animate={{
            opacity: [0.7, 1, 0.7],
            x: [0, 2, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div 
          className="h-40 w-40 rounded-full"
          style={{ background: '#9ca3af' }}  // Changed to gray-400
          animate={{
            opacity: [0.7, 1, 0.7],
            scale: [0.98, 1, 0.98]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.3
          }}
        />
      </motion.div>

      <div>
        <motion.div 
          style={iconWhite}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="w-20 h-20 rounded-full"
            style={{ background: '#d1d5db' }}  // Changed to gray-300
            animate={{
              opacity: [0.7, 1, 0.7],
              scale: [0.98, 1, 0.98]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.6
            }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function ScrollTriggered() {
  const [cards, setCards] = useState([food[0]]);
  const [index, setIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const handleAddCard = async () => {
    if (index + 1 >= food.length) return;
    
    setIsLoading(true);
    console.log('Setting loading to true'); // Debug log
    
    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setCards(prev => [...prev, food[index + 1]]);
    setIndex(prev => prev + 1);
    setIsLoading(false);
    console.log('Setting loading to false'); // Debug log
  };

  useEffect(() => {
    // Automatically add another card if the last added card is even-indexed
    if (index % 2 != 0 && index + 1 < food.length) {
      handleAddCard();
    }
  }, [index]);
  return (
    <div style={container}>
      {/* Destructure text from the food array item */}
      {cards.map(([text], i) => (
        <Card 
          i={i} 
          text={text}
          key={i} 
          onSubmit={handleAddCard}
        />
      ))}
      {isLoading && <SkeletonCard />}
    </div>
  );
}

function Card({ text, i, onSubmit }) {
  const [inputText, setInputText] = useState("");
  const [submittedText, setSubmittedText] = useState("");

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleSubmit = () => {
    if (inputText !== "") {
      setSubmittedText(inputText);
      onSubmit();
      setInputText("");
    } else {
      alert("Please enter some text!");
    }
  };
  return (
    <motion.div
      className={`card-container-${i}`}
      style={cardContainer}
      initial="offscreen"
      whileInView="onscreen"
      viewport={{ amount: 0.8 }}
    >
      {/* <div style={{ ...splash, background }} /> */}
      
      <div>
        {i % 2 !== 0 ? (
          <motion.div style={iconContainer} className="iconRightContainer">
            <motion.div
              style={icon}
              className="iconRight"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 1 }}
              whileDrag={{ scale: 0.9, rotate: 10 }}
              drag
            />
          </motion.div>
        ) : (
          <motion.div
            style={iconWhite}
            className="iconWhite"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 1 }}
            whileDrag={{ scale: 0.9, rotate: 10 }}
            drag
          />
        )}
      </div>
      <motion.div style={card} variants={cardVariants} className="card">
        {i % 2 !== 0 ? (
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2, duration: 0.5 }}
            style={{
              fontSize: "20px",
              marginRight: "20px",
              display: "inline-block",   
              textAlign: "left",          
              verticalAlign: "top",  
              width: "500px",
              padding: "30px",
            }}
          >
            {text} {/* Odd-indexed cards directly show text */}
          </motion.span>
        ) : (
          !submittedText ? (
            <div>
              <input
                type="text"
                value={inputText}
                onChange={handleInputChange}
                placeholder="Enter text"
                style={{ marginRight: "10px", fontSize: "20px", padding: "5px" }}
              />
              <button
                onClick={handleSubmit}
                style={{
                  fontSize: "20px",
                  padding: "5px 10px",
                  cursor: "pointer",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                }}
              >
                Submit
              </button>
            </div>
            ): (
              // After submission, show the submitted text
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2, duration: 0.5 }}
                style={{
                  fontSize: "20px",
                  marginRight: "20px",
                  display: "inline-block",   
                  textAlign: "left",          
                  verticalAlign: "top",  
                  width: "500px",  
                  padding: "30px", 
                }}
              >
                {submittedText} {/* Display the submitted text */}
              </motion.span>
            )
        )}
      </motion.div>
      <div>
        {i % 2 === 0 ? (
          <motion.div style={iconContainer} className="iconRightContainer">
            <motion.div
              style={icon}
              className="iconLeft"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 1 }}
              whileDrag={{ scale: 0.9, rotate: 10 }}
              drag
            />
          </motion.div>
        ) : (
          <motion.div
            style={iconWhite}
            className="iconWhite"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 1 }}
            whileDrag={{ scale: 0.9, rotate: 10 }}
            drag
          />
        )}
      </div>
    </motion.div>
  )
}

const cardVariants = {
  offscreen: {
    y: 300,
  },
  onscreen: {
    y: 50,
    rotate: 0,
    transition: {
      type: "spring",
      bounce: 0.4,
      duration: 0.8,
    },
  },
}

const container = {
  margin: "100px auto",
  maxWidth: 1050,
  paddingBottom: 100,
  width: "100%",
}

const cardContainer = {
  overflow: "hidden",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  position: "relative",
  paddingTop: 20,
  marginBottom: -120,
}

const iconContainer = {
  overflow: "hidden",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  position: "relative",
  paddingTop: 20,
  marginBottom: -120,
}

const card = {
  fontSize: 164,
  minWidth: 800,   
  height: "auto",
  minHeight: 150,
  marginBottom: 120,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: 20,
  background: "#f5f5f5",
  transform: "rotate(30deg)",
  boxShadow:
    "0 0 1px hsl(0deg 0% 0% / 0.075), 0 0 2px hsl(0deg 0% 0% / 0.075), 0 0 4px hsl(0deg 0% 0% / 0.075), 0 0 8px hsl(0deg 0% 0% / 0.075), 0 0 16px hsl(0deg 0% 0% / 0.075)",
  transformOrigin: "10% 60%",
}

const icon = {
  width: 50,
  height: 50,
  margin: 30,
  backgroundColor: "green",
  backgroundImage: `url(${logo})`,
  backgroundSize: "cover", // Ensure the image covers the entire element
  backgroundRepeat: "no-repeat", // Prevent repeating
  backgroundPosition: "center",
  borderRadius: "50%",
  position: "relative", // Enable relative positioning
  bottom: "35px",       // Elevate the icon a little bit by 10px
  display: "flex",      // Flexbox for centering content inside
  justifyContent: "center",  // Center content horizontally
  alignItems: "center",
}

const iconWhite = {
  width: 50,
  height: 50,
  margin: 30,
  backgroundColor: "transparent",
  borderRadius: "50%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
}

const food = [
  ["Fresh"],
  ["and"],
  ["Tasty"],
  ["Fruits"],
  ["For"],
  ["Your"],
  ["Health"],
  ["Today"],
]