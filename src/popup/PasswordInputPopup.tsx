import React, { useState } from 'react';
import './PasswordInputPopup.css'; // Add styles for consistent layout

interface PasswordInputPopupProps {
  onConfirm: (password: string) => void;
  onClose: () => void;
  errorMessage?: string | null;
}

const PasswordInputPopup: React.FC<PasswordInputPopupProps> = ({
  onConfirm,
  onClose,
  errorMessage,
}) => {
  const [password, setPassword] = useState('');

  const handleConfirm = () => {
    if (password.trim() === '') {
      alert('Please enter your password.');
      return;
    }
    onConfirm(password);
  };

  return (
    <div className="password-popup-overlay">
      <div className="password-popup">
        <h3>Enter Your Password</h3>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
        />
        <p className="password-popup-error-message">{errorMessage || '\u00A0'}</p>
        <div className="popup-actions">
          <button onClick={handleConfirm}>Confirm</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default PasswordInputPopup;