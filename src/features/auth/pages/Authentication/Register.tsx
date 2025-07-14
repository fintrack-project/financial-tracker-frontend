import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isStrongPassword, isValidEmail } from '../../../../shared/utils/validationUtils';
import InputField from '../../../../shared/components/InputField/InputField';
import Button from '../../../../shared/components/Button/Button';
import AuthBasePage from './AuthBasePage';
import { registerUser } from '../../services/authService';
import './Register.css';

const Register: React.FC = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [errorType, setErrorType] = useState<'error' | 'warning'>('error');
  const navigate = useNavigate();

  const handleRegister = async () => {
    // Clear previous errors
    setError('');
    setErrorType('error');

    if (!userId || !password || !email) {
      setError('User ID, Password, and Email are required.');
      setErrorType('error');
      return;
    }

    if (!isStrongPassword(password)) {
      setError('Password must be at least 8 characters long, include uppercase, lowercase, a number, and a special character.');
      setErrorType('error');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setErrorType('error');
      return;
    }

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      setErrorType('error');
      return;
    }

    try {
      await registerUser({ userId, password, email });
      // Registration successful - redirect to login page
      alert('Registration successful! You can now log in to your account.');
      navigate('/'); // Redirect to login page
    } catch (err: any) {
      const errorMessage = err.message;
      setError(errorMessage);
      
      // Set error type based on the error message
      if (errorMessage.includes('User ID already exists') || errorMessage.includes('Email already exists')) {
        setErrorType('warning');
      } else {
        setErrorType('error');
      }
    }
  };

  return (
    <AuthBasePage title="Register">
      <div className="register-container">
        <p className="register-comment">
          Join us and take control of your finances today!
        </p>
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
          <InputField
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <InputField
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="message-container">
          {error && (
            <p className={`message ${errorType === 'warning' ? 'register-warning-message' : 'register-error-message'} visible`}>
              {error}
            </p>
          )}
        </div>
        <div className="register-actions">
          <Button onClick={handleRegister} className="register-button">
            Register
          </Button>
          <Button onClick={() => navigate('/')} className="secondary-button">
            Back to Login
          </Button>
        </div>
      </div>
    </AuthBasePage>
  );
};

export default Register;