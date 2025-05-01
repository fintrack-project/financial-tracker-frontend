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

  const handleRegister = async () => {
    if (!userId || !password || !email) {
      setError('User ID, Password, and Email are required.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const message = await registerUser({ userId, password, email, phone, address }); // Use the register service
      alert(message);
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

        {error && <p className="error-message">{error}</p>}

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