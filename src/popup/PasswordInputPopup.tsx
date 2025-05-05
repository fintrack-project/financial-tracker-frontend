import React, { useState } from 'react';

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
    <div className="password-popup">
      <div className="popup-content">
        <h3>Enter Your Password</h3>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
        />
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <div className="popup-actions">
          <button onClick={handleConfirm}>Confirm</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default PasswordInputPopup;