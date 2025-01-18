import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion'
import logo from './logo.svg';

export default function ScrollTriggered() {
  const [cards, setCards] = useState([food[0]]);
  const [index, setIndex] = useState(0);

  const handleAddCard = () => {
    if (index + 1 < food.length) {
      setCards((prev) => [...prev, food[index + 1]]);
      setIndex(index + 1);
    }
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
      {cards.map(([text, emoji, hueA, hueB], i) => (
        <Card 
          i={i} 
          text={text}    // Pass text as prop
          emoji={emoji} 
          hueA={hueA} 
          hueB={hueB} 
          key={emoji} 
          onSubmit={handleAddCard}
        />
      ))}
    </div>
  )
}

function Card({ text, emoji, hueA, hueB, i, onSubmit }) {
  const background = `linear-gradient(306deg, ${hue(hueA)}, ${hue(hueB)})`
  const [inputText, setInputText] = useState("");

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleSubmit = () => {
    if (inputText !== "") {
      console.log(`Card ${i}: Submitted text - "${inputText}"`); // Debugging log
      onSubmit(); // Trigger the addition of a new card
      setInputText(""); // Clear the input field
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
            style={{ fontSize: "64px", marginRight: "20px" }}
          >
            {text} {/* Odd-indexed cards directly show text */}
          </motion.span>
        ) : (
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
        )}
        <motion.span
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.2 + 0.3, duration: 0.5 }}
          style={{ fontSize: "164px" }}
        >
          {emoji}
        </motion.span>
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

const hue = (h) => `hsl(${h}, 100%, 50%)`

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

// const splash = {
//   position: "absolute",
//   top: 0,
//   left: 0,
//   right: 0,
//   bottom: 0,
//   clipPath: `path("M 0 403.5 L 1500 303.5 L 800 500 L 0 500 Z")`
//   // `path("M 0 303.5 C 0 292.454 8.995 285.101 20 283.5 L 460 219.5 C 470.085 218.033 480 228.454 480 239.5 L 500 430 C 500 441.046 491.046 450 480 450 L 20 450 C 8.954 450 0 441.046 0 430 Z")`,
// }

const card = {
  fontSize: 164,
  minWidth: 800,   
  height: "auto",
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
  width: 80,
  height: 80,
  margin: 30,
  backgroundColor: "green",
  backgroundImage: `url(${logo})`,
  backgroundSize: "cover", // Ensure the image covers the entire element
  backgroundRepeat: "no-repeat", // Prevent repeating
  backgroundPosition: "center",
  borderRadius: "50%",
  display: "flex-end",
  justifyContent: "flex-end",
  alignItems: "center",
}

const iconWhite = {
  width: 80,
  height: 80,
  margin: 30,
  backgroundColor: "#ffffff",
  borderRadius: "50%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
}

const food = [
  ["Fresh", "🍅", 340, 10],
  ["and", "🍊", 20, 40],
  ["Tasty", "🍋", 60, 90],
  ["Fruits", "🍐", 80, 120],
  ["For", "🍏", 100, 140],
  ["Your", "🫐", 205, 245],
  ["Health", "🍆", 260, 290],
  ["Today", "🍇", 290, 320],
]