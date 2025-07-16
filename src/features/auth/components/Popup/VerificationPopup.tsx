import React, { useState, useEffect } from 'react';
import './VerificationPopup.css'; // Add styles for the popup

interface VerificationPopupProps {
  title: string; // Title of the popup
  instructions: string; // Instructions to display
  customInput?: React.ReactNode; // Custom input field (e.g., SixDigitInput)
  onVerify?: (code: string) => void; // Callback when verification is successful
  onResend?: () => void; // Callback to resend the verification
  onClose: () => void; // Callback to close the popup
  errorMessage?: string | null; // Optional error message to display
}

const VerificationPopup: React.FC<VerificationPopupProps> = ({
  title,
  instructions,
  customInput,
  onVerify,
  onResend,
  onClose,
  errorMessage,
}) => {
  const [code, setCode] = useState('');
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes in seconds

  useEffect(() => {
    // Timer logic
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onClose(); // Close the popup when the timer expires
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer); // Cleanup timer on unmount
  }, [onClose]);

  const handleVerify = () => {
    if (onVerify) {
      onVerify(code); // Pass the code to the verify callback
    }
  };

  const handleResend = () => {
    setTimeLeft(120); // Reset the timer to 2 minutes
    setCode(''); // Clear the input field
    if(onResend) {
      onResend(); // Call the resend callback
    }
  };

  return (
    <div className="verification-popup">
      <div className="popup-content">
        <h2>{title}</h2>
        <p>{instructions}</p>
        {customInput !== undefined && customInput}
        {errorMessage && (
          <p className="popup-error-message has-error">{errorMessage}</p>
        )}
        <div className="popup-timer">
          Time left: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
        </div>
        <div className="popup-actions">
          {onVerify && <button className="primary" onClick={handleVerify}>Verify</button>}
          {onResend && <button className="primary" onClick={handleResend}>Resend</button>}
          <button className="secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default VerificationPopup;