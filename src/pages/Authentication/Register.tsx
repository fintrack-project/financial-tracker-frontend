import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from '../../components/InputField/InputField';
import Button from 'components/Button/Button';
import AuthBasePage from './AuthBasePage';
import { registerUser } from 'services/registerService';
import './Register.css';

const Register: React.FC = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const isStrongPassword = (password: string) => {
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return strongPasswordRegex.test(password);
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPhone = (phone: string) => {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/; // E.164 format
    return phoneRegex.test(phone);
  };

  const sendEmailVerification = async (email: string) => {
    alert(`A verification link has been sent to ${email}. Please verify your email.`);
  };

  const sendSMSVerification = async (phone: string) => {
    alert(`A verification code has been sent to ${phone}. Please verify your phone number.`);
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

    if (phone && !isValidPhone(phone)) {
      setError('Please enter a valid phone number.');
      return;
    }

    if (address && address.trim().length < 5) {
      setError('Address must be at least 5 characters long.');
      return;
    }

    try {
      const message = await registerUser({ userId, password, email, phone, address });
      alert(message);

      await sendEmailVerification(email);
      if (phone) {
        await sendSMSVerification(phone);
      }

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
          <InputField
            type="tel"
            placeholder="Phone Number (Optional)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <InputField
            type="text"
            placeholder="Address (Optional)"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            isTextArea={true}
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