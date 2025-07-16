import React, { useState } from 'react';
import './PasswordInputPopup.css'; // Add styles for consistent layout

interface PasswordInputPopupProps {
  onConfirm: (password: string) => void;
  onClose: () => void;
  errorMessage?: string | null;
  setErrorMessage?: (msg: string | null) => void;
}

const PasswordInputPopup: React.FC<PasswordInputPopupProps> = ({
  onConfirm,
  onClose,
  errorMessage,
  setErrorMessage,
}) => {
  const [password, setPassword] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (setErrorMessage) setErrorMessage(null);
  };

  const handleConfirm = () => {
    onConfirm(password);
  };

  return (
    <div className="password-popup-overlay">
      <div className="password-popup">
        <h3>Enter Your Password</h3>
        <input
          type="password"
          value={password}
          onChange={handleInputChange}
          placeholder="Enter your password"
        />
        {errorMessage && (
          <p className="password-popup-error-message has-error">{errorMessage}</p>
        )}
        <div className="popup-actions">
          <button onClick={handleConfirm}>Confirm</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default PasswordInputPopup;