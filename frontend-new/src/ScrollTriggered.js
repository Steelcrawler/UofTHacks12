import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion'
import logo from './logo.png';
import user from './user.svg';
import submitButton from './submitButton.svg';

function StreamingText({ text, delay, i }) {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const containerRef = React.useRef(null);

  useEffect(() => {
    let index = 0;
    setDisplayedText('');
    setIsComplete(false);
    let isMounted = true;

    const streamText = async () => {
      while (index < text.length && isMounted) {
        await new Promise(resolve => setTimeout(resolve, 30));
        if (isMounted) {
          setDisplayedText(text.substring(0, index + 1));
          index++;
        }
      }
      if (isMounted) {
        setIsComplete(true);
      }
    };

    streamText();

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [text]);

  useEffect(() => {
    if (containerRef.current) {
      // Smooth scroll to bottom
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [displayedText]);

  return (
    <motion.div
      ref={containerRef}
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
        maxHeight: "300px",
        overflowY: "auto",
        overflowX: "hidden",
        scrollbarWidth: "thin",
        scrollbarColor: "#888 #f5f5f5",
        whiteSpace: "pre-wrap",  // Preserve formatting
        wordBreak: "break-word"  // Prevent horizontal overflow
      }}
      className="streaming-text-container"
    >
      {displayedText}
      {!isComplete && <span className="typing-cursor">▋</span>}
    </motion.div>
  );
}

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
  const [cards, setCards] = useState([conversation[0]]);
  console.log("very start", conversation);
  const [index, setIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const handleAddCard = async () => {
    // if (index + 1 >= conversation.length) return;
    
    setIsLoading(true);
    console.log('Setting loading to true'); // Debug log
    
    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log("in handleAddCard,", conversation);
    setCards(prev => [...prev, conversation[index + 1]]);
    setIndex(prev => prev + 1);
    // conversation = conversation.concat([""]);
    console.log("in handleAddCard, after concatenation,", conversation);
    setIsLoading(false);
    console.log('Setting loading to false'); // Debug log
  };

  useEffect(() => {
    // Automatically add another card if the last added card is even-indexed
    if (index % 2 != 0 && index + 1 < conversation.length) {
      handleAddCard();
    }
  }, [index]);
  return (
    <div style={container}>
      {/* Destructure text from the conversation array item */}
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
    if (inputText.trim() !== "") {
      // Create the JSON object
      const data = {
        submittedText: inputText,
      };
  
      // Send the JSON object to the Flask endpoint
      fetch("http://127.0.0.1:5000/endpointj", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          console.log("response", response)
          return response.json();
        })
        .then((data) => {
          console.log("Successfully submitted:", data);
          console.log(conversation);
          // Update the state to reflect the submission
          conversation[conversation.length - 1] = [inputText];
          conversation = conversation.concat([[data.bot_response]]);
          // conversation = conversation.concat([["..."]]);
          console.log(conversation);
          setSubmittedText(inputText);
          onSubmit(); // Call the callback function if needed
          setInputText(""); // Clear the input
        })
        .catch((error) => {
          console.error("Error submitting data:", error);
          alert("Failed to submit. Please try again.");
        });
    } else {
      alert("Please enter some text!");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
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
      <div>
        {i % 2 !== 0 ? (
          <motion.div style={iconContainer} className="iconRightContainer">
            <motion.div
              style={iconLeft}
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
      <motion.div style={card} variants={cardVariants} className="card">
        {i % 2 !== 0 ? (
          // Bot response - uses StreamingText
          <StreamingText text={text} i={i} />
        ) : (
          !submittedText ? (
            <div 
            style={{
              display: "flex", // Makes the input and button appear side-by-side
              alignItems: "center", // Aligns the input and button vertically in the center
              gap: "10px", // Adds consistent spacing between the input and the button
            }}>
              <textarea
                value={inputText}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Enter text"
                style={{
                  width: "300px", // Fixed width
                  minHeight: "50px", // Minimum height
                  fontSize: "18px", // Adjust the font size
                  padding: "10px", // Space inside the textarea
                  borderRadius: "8px", // Rounded corners
                  border: "1px solid #ccc", // Border style
                  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // Depth effect
                  outline: "none", // Remove the default outline
                  resize: "none", // Disable manual resizing (optional)
                  overflow: "hidden", // Prevent scrollbars
                  transition: "height 0.2s ease", // Smooth transition when expanding
                }}
                rows={1} // Initial row count
                onInput={(e) => {
                  e.target.style.height = "auto"; // Reset height to auto
                  e.target.style.height = `${e.target.scrollHeight}px`; // Set height to scrollHeight (auto expansion)
                }}
              />
              <motion.div
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.8 }}
                style={{
                  width: 40,
                  height: 40,
                  backgroundImage: `url(${submitButton})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  borderRadius: 5,
                }}
                onClick={handleSubmit}
              />
            </div>
          ) : (
            // User submitted text - uses StreamingText
            <StreamingText text={submittedText} i={i} />
          )
        )}
      </motion.div>
      <div>
        {i % 2 === 0 ? (
          <motion.div style={iconContainer} className="iconRightContainer">
            <motion.div
              style={iconRight}
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
    </motion.div>
  );
}

const inputContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  width: '80%',
  padding: '20px',
};

const textareaStyle = {
  width: '100%',
  minHeight: '100px',
  padding: '12px',
  fontSize: '16px',
  borderRadius: '8px',
  border: '1px solid #ccc',
  resize: 'vertical',
  fontFamily: 'inherit',
};

const submitButtonStyle = {
  padding: '12px 24px',
  fontSize: '16px',
  backgroundColor: '#4CAF50',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  transition: 'background-color 0.3s',
  ':hover': {
    backgroundColor: '#45a049',
  },
};

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

const iconLeft = {
  width: 50,
  height: 50,
  margin: 30,
  backgroundColor: "#add8e6",
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

const iconRight = {
  width: 50,
  height: 50,
  margin: 30,
  backgroundColor: "#add8e6",
  backgroundImage: `url(${user})`,
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

let conversation = [
  [""],
];

const cssStyles = `
  .typing-cursor {
    display: inline-block;
    width: 2px;
    animation: blink 1s infinite;
    margin-left: 4px;
  }

  @keyframes blink {
    0% { opacity: 1; }
    50% { opacity: 0; }
    100% { opacity: 1; }
  }

  .streaming-text-container::-webkit-scrollbar {
    width: 8px;
  }

  .streaming-text-container::-webkit-scrollbar-track {
    background: #f5f5f5;
    border-radius: 4px;
  }

  .streaming-text-container::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
  }

  .streaming-text-container::-webkit-scrollbar-thumb:hover {
    background: #666;
  }
`;

const styleSheet = document.createElement("style");
styleSheet.innerText = cssStyles;
document.head.appendChild(styleSheet);