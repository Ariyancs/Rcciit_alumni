import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    try {
      const response = await axios.post('http://localhost:5000/login', { email, password });
      if (response.data.success) {
        setMessage('Login successful!');
        navigate('/dashboard');
      } else {
        setMessage('Login failed. Please check your credentials.');
      }
    } catch (err: any) {
      setMessage('Error: ' + (err.response?.data?.error || 'Network Error'));
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCreateAccount = () => {
    navigate('/');
  };

  return (
    <div className="login-container">
      <div className="login-header">
        <h1>Alumni Login</h1>
        <p>Access your dashboard</p>
      </div>
      {message && <div className="message-box">{message}</div>}
      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="login-input"
          disabled={isLoading}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-input"
          disabled={isLoading}
        />
        <button type="submit" className="login-button" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Log In'}
        </button>
      </form>
      <div className="login-footer">
        <p>Don't have an account?</p>
        <button onClick={handleCreateAccount} className="create-account-button">
          Create an account
        </button>
      </div>
    </div>
  );
};

export default Login;