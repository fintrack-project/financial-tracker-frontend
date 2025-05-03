import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from '../../components/InputField/InputField';
import Button from 'components/Button/Button';
import AuthBasePage from './AuthBasePage';
import { loginUser } from '../../services/authService';
import UserSession from '../../utils/UserSession';
import './Login.css';

const Login: React.FC = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null); // State to handle errors
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError(null); // Clear any previous errors

    try {
      await loginUser({ userId, password }); // Call the login service
      const session = UserSession.getInstance();

      if (session.isLoggedIn()) {
        const userId = session.getUserId();
        console.log('Logged in as:', userId);
        navigate('/platform/dashboard'); // Redirect to the platform
      } else {
        throw new Error('Login failed: Unable to verify session.');
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message); // Display the error message to the user
        alert(err.message); // Optional: Show an alert with the error message
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
          <div className="forgot-password" onClick={() => alert('Forgot password clicked')}>
            Forgot password?
          </div>
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    </AuthBasePage>
  );
};

export default Login;