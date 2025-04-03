import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from '../../components/InputField/InputField';
import './Login.css';
import Button from 'components/Button/Button';

const Login: React.FC = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    // For now, allow login with any user ID and password
    if (userId && password) {
      console.log('User logged in:', { userId, password });
      navigate('/dashboard'); // Redirect to the dashboard
    } else {
      alert('Please enter both user ID and password.');
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