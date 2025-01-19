import './LoginRegisterWindow.css';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
// import { useGoogleLogin, GoogleLogin } from '@react-oauth/google';
import axios from 'axios';

const LoginRegisterWindow = ({ onClose, onLoginSuccess }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const loginRegisterCardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/api/google-login', {
        credential: credentialResponse.credential
      });
      
      if (response.status === 200) {
        console.log('Google login successful', response);
        onLoginSuccess(response.data.email)
        onClose();
      }
      } catch (error) {
        console.error('Error during Google login:', error);
        setError('Something went wrong during Google login');
      }
  };

  const handleGoogleError = () => {
    setError('Google login failed');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isRegistering && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (email && password) {
        const url = isRegistering
          ? 'http://127.0.0.1:5000/api/register'
          : 'http://127.0.0.1:5000/api/login';

        axios.post(url, { email, password })
        .then((response) => {
          if (response.status === 200) {
            console.log('Form submitted:', { email, password });
            if (!isRegistering) {
              onLoginSuccess(email);
            }
            onClose();
          } else {
            setError(response.data.message);  // Display error message from backend
          }
        })
        .catch((error) => {
          console.error('Error submitting form:', error);
          setError(error.response?.data?.message || 'Something went wrong');  // Display a generic error message
        });
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
        className="login-register-card"
        initial="hidden"
        animate="visible"
        variants={loginRegisterCardVariants}
      >
        <button onClick={onClose} className="close-btn">X</button>
        <div className="login-register-card-content">
          <h2>{isRegistering ? 'Register' : 'Login'}</h2>
          
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

          {/* <div className="google-signin-button">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              useOneTap
            />
          </div> */}

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