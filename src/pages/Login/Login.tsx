import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from '../../components/InputField/InputField';
import './Login.css';
import Button from 'components/Button/Button';
import { loginUser } from '../../services/authService'; // Import the login service

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
      const message = await loginUser({ userId, password }); // Use the login service
      alert(message);
      navigate('/dashboard'); // Redirect to the dashboard
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