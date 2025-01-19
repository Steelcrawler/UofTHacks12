import './About.css';
import React, { useState } from 'react';
import { motion } from 'framer-motion';

const About = ({ onClose }) => {
  const [isOpen, setIsOpen] = useState(true);

  const aboutCardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const handleClose = () => {
    setIsOpen(false);
    onClose();
  };

  return (
    <motion.div
      className="overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {isOpen && (
        <motion.div
          className="about-card"
          initial="hidden"
          animate="visible"
          variants={aboutCardVariants}
        >
          <button onClick={handleClose} className="close-btn">X</button>
          <div className="about-card-content">
            <h2>About The Other Side</h2>
            <p>
            <b style={{ color: 'red' }}>Important Notice:</b> We are currently in beta testing phase, and debate topics are limited to <b style={{ color: 'red' }}>Abortion, Gun Laws, Immigration, AI Regulation, Gene Editing, Universal Healthcare and Universal Basic Income</b>.
            </p>
            <p>
            Our mission is to present people with a place to test the validity of their beliefs and expose themselves to new ideas from reliable sources advocating for all sides of a topic. By leveraging advanced AI and a curated knowledge base, we aim to foster meaningful dialogue and deeper understanding across different viewpoints.
            </p>
            <p>
                <b>How to Use: </b>Simply input your opinions, and our agent will provide facts and arguments to refute them.
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default About;
