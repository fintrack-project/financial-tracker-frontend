import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from '../../../../shared/components/InputField/InputField';
import Button from '../../../../shared/components/Button/Button';
import AuthBasePage from './AuthBasePage';
import { loginUser } from '../../services/authService';
import './Login.css';

const Login: React.FC = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null); // State to handle errors
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError(null); // Clear any previous errors
  
    try {
      // Call the login service
      await loginUser({ userId, password });
  
      // If login is successful, navigate to the dashboard
      console.log('Login successful!');
      navigate('/platform/dashboard'); // Redirect to the platform
    } catch (err) {
      // Handle errors from the backend or unexpected errors
      console.log('Login error:', err);
      if (err instanceof Error) {
        setError(err.message); // Display the error message from the backend
      } else {
        setError('An unexpected error occurred. Please try again later.');
      }
    }
  };

  return (
    <AuthBasePage title="Login">
      <div className="login-container">
        <div className="register-link" onClick={() => navigate('/register')}>
          Don't have an account? Register
        </div>

        <div className="input-fields">
          <InputField
            type="text"
            placeholder="User ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
          <InputField
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="login-actions">
          <Button onClick={handleLogin} className="login-button">
            Login
          </Button>
          <div 
            className="forgot-password" 
            onClick={() => navigate('/request-password-reset')}
          >
            Forgot password?
          </div>
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    </AuthBasePage>
  );
};

export default Login;