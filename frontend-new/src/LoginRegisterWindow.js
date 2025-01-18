import './LoginRegisterWindow.css';
import React, { useState } from 'react';
import { motion } from 'framer-motion';

const LoginRegisterWindow = ({ onClose }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isRegistering && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (email && password) {
      // Handle form submission (this can be extended once the backend is implemented)
      console.log('Form submitted:', { email, password });
      onClose(); // Close the modal on successful submission
    }
  };

  return (
    <motion.div
      className="overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="card"
        initial="hidden"
        animate="visible"
        variants={cardVariants}
      >
        <button onClick={onClose} className="close-btn">X</button>
        <div className="card-content">
          <h2>{isRegistering ? 'Register' : 'Login'}</h2>
          
          {/* Show error message if any */}
          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input 
                type="password" 
                id="password" 
                name="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>

            {isRegistering && (
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input 
                  type="password" 
                  id="confirmPassword" 
                  name="confirmPassword" 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  required 
                />
              </div>
            )}

            <button type="submit" className="submit-btn">
              {isRegistering ? 'Register' : 'Login'}
            </button>
          </form>

          {/* First time user section */}
          <div className="toggle-register">
            {isRegistering ? (
              <p>Already have an account? <span onClick={() => setIsRegistering(false)} className="toggle-link">Login here</span></p>
            ) : (
              <p>First time? <span onClick={() => setIsRegistering(true)} className="toggle-link">Register here</span></p>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LoginRegisterWindow;
