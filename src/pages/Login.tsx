import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from '../components/InputField/InputField';
import './Login.css';
import Button from 'components/Button/Button';
import { loginUser } from '../services/authService';
import UserSession from '../utils/UserSession';

const Login: React.FC = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!userId || !password) {
      alert('Please enter both user ID and password.');
      return;
    }
  
    try {
      const session = UserSession.getInstance();

      // Prevent multiple users from logging in
      if (session.isLoggedIn()) {
        alert('A user is already logged in. Please log out first.');
        return;
      }

      const message = await loginUser({ userId, password }); // Use the auth service
      const loginSuccess = session.login(userId); // Log in the user in the singleton
      session.setUserId(userId); // Set the user ID in the singleton

      if (loginSuccess) {
        alert(message);
        navigate('/platform/dashboard'); // Redirect to the dashboard
      } else {
        alert('Failed to log in. Another user is already logged in.');
      }
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      <div className="input-container">
        <InputField
          type="text"
          placeholder="User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
      </div>
      <div className="input-container">
        <InputField
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="button-container">
      <Button onClick={handleLogin} className="login-button">
        Login
      </Button>
      <Button onClick={() => navigate('/register')} className="register-button">
        Register
      </Button>
      </div>
    </div>
  );
};

export default Login;