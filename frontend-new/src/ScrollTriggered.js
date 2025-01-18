import React from 'react'
import { motion } from 'framer-motion'
import logo from './logo.svg';

export default function ScrollTriggered() {
  return (
    <div style={container}>
      {food.map(([emoji, hueA, hueB], i) => (
        <Card i={i} emoji={emoji} hueA={hueA} hueB={hueB} key={emoji} />
      ))}
    </div>
  )
}

function Card({ emoji, hueA, hueB, i }) {
  const background = `linear-gradient(306deg, ${hue(hueA)}, ${hue(hueB)})`
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
        {i % 2 != 0 ? (
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
        {emoji}
      </motion.div>
      <div>
        {i % 2 == 0 ? (
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
  width: 900,
  height: 330,
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
  ["🍅", 340, 10],
  ["🍊", 20, 40],
  ["🍋", 60, 90],
  ["🍐", 80, 120],
  ["🍏", 100, 140],
  ["🫐", 205, 245],
  ["🍆", 260, 290],
  ["🍇", 290, 320],
]