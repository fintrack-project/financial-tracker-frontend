import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from '../../components/InputField/InputField';
import './Register.css';
import Button from 'components/Button/Button';
import { registerUser } from 'services/registerService';

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
    <div className="register-container">
      <h1>Register</h1>
      {error && <p className="error-message">{error}</p>}
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
      <div className="button-container">
        <Button onClick={handleRegister}>Register</Button>
        <Button onClick={() => navigate('/')} className="secondary-button">
          Back to Login
        </Button>
      </div>
    </div>
  );
};

export default Register;