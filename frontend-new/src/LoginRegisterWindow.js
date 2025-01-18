// import './LoginRegisterWindow.css';
import React, { useState } from 'react';
import { motion } from 'framer-motion';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      // Handle login logic (backend integration needed here)
      console.log('Logging in with:', formData);
    } else {
      // Handle registration logic (backend integration needed here)
      console.log('Registering with:', formData);
    }
  };

  const formVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      className="auth-container"
      initial="hidden"
      animate="visible"
      variants={formVariants}
    >
      <h2>{isLogin ? 'Login' : 'Register'}</h2>
      <form onSubmit={handleSubmit}>
        <motion.div className="form-group" initial="hidden" animate="visible" variants={formVariants}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </motion.div>

        <motion.div className="form-group" initial="hidden" animate="visible" variants={formVariants}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </motion.div>

        {!isLogin && (
          <motion.div className="form-group" initial="hidden" animate="visible" variants={formVariants}>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </motion.div>
        )}

        <motion.button type="submit" initial="hidden" animate="visible" variants={formVariants}>
          {isLogin ? 'Login' : 'Register'}
        </motion.button>
      </form>

      <p>
        {isLogin ? "Don't have an account?" : 'Already have an account?'}
        <span onClick={() => setIsLogin(!isLogin)} className="toggle-link">
          {isLogin ? 'Register' : 'Login'}
        </span>
      </p>
    </motion.div>
  );
};

export default AuthForm;
