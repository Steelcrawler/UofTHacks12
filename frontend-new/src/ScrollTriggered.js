import React from 'react'
import { motion } from 'framer-motion'

export default function ScrollTriggered() {
  return (
    <div style={container}>
            {/* Destructure text from the food array item */}
            {food.map(([text, emoji, hueA, hueB], i) => (
        <Card 
          i={i} 
          text={text}    // Pass text as prop
          emoji={emoji} 
          hueA={hueA} 
          hueB={hueB} 
          key={emoji} 
        />
      ))}
    </div>
  )
}

function Card({ text, emoji, hueA, hueB, i }) {
  const background = `linear-gradient(306deg, ${hue(hueA)}, ${hue(hueB)})`
  return (
    <motion.div
      className={`card-container-${i}`}
      style={cardContainer}
      initial="offscreen"
      whileInView="onscreen"
      viewport={{ amount: 0.8 }}
    >
      <div style={{ ...splash, background }} />
      <motion.div style={card} variants={cardVariants} className="card">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.2, duration: 0.5 }}
          style={{ fontSize: '64px', marginRight: '20px' }}
        >
          {text}  {/* Now text will be properly defined */}
        </motion.span>
        <motion.span
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.2 + 0.3, duration: 0.5 }}
          style={{ fontSize: '164px' }}
        >
          {emoji}
        </motion.span>
      </motion.div>
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

const splash = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  clipPath: `path("M 0 303.5 C 0 292.454 8.995 285.101 20 283.5 L 460 219.5 C 470.085 218.033 480 228.454 480 239.5 L 500 430 C 500 441.046 491.046 450 480 450 L 20 450 C 8.954 450 0 441.046 0 430 Z")`,
}

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