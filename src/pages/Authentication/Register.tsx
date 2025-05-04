import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isStrongPassword, isValidEmail } from '../../utils/validationUtils';
import InputField from '../../components/InputField/InputField';
import Button from 'components/Button/Button';
import AuthBasePage from './AuthBasePage';
import { registerUser } from 'services/authService';
import './Register.css';

const Register: React.FC = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // TODO : check if registering really sends verification email
  const sendEmailVerification = async (email: string) => {
    alert(`Registration successful! A verification link has been sent to ${email}. Please verify your email.`);
  };

  const handleRegister = async () => {
    if (!userId || !password || !email) {
      setError('User ID, Password, and Email are required.');
      return;
    }

    if (!isStrongPassword(password)) {
      setError('Password must be at least 8 characters long, include uppercase, lowercase, a number, and a special character.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    try {
      const message = await registerUser({ userId, password, email });
      alert(message);

      await sendEmailVerification(email);

      navigate('/'); // Redirect to login page
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <AuthBasePage title="Register">
      <div className="register-container">
        <p className="register-comment">
          Join us and take control of your finances today!
        </p>

        {error && <p className="error-message visible">{error}</p>}
        {!error && <p className="error-message">&nbsp;</p>} {/* Empty space when no error */}

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