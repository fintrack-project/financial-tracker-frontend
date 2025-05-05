import React, { useState, useEffect } from 'react';
import VerificationPopup from './VerificationPopup';
import SixDigitInput from '../components/InputField/SixDigitInput'; // Import the SixDigitInput component

interface OTPVerificationPopupProps {
  onClose: () => void;
  onVerify: (otp: string) => void;
  errorMessage?: string | null;
}

const OTPVerificationPopup: React.FC<OTPVerificationPopupProps> = ({ 
  onClose, 
  onVerify, 
  errorMessage 
}) => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState<string | null>(null); // Track error message

  // Synchronize the local error state with the errorMessage prop
  useEffect(() => {
    setError(errorMessage || null);
  }, [errorMessage]);

  const handleVerify = () => {
    if (!otp.trim()) {
      setError('Please enter a verification code.');
      return;
    }

    if (otp.length === 6) {
      onVerify(otp);
    } else {
      setError('Please enter a valid 6-digit OTP.');
    }
  };

  return (
    <VerificationPopup
      title="Verify OTP"
      instructions="Please enter the 6-digit OTP sent to your authenticator app."
      customInput={
        <SixDigitInput 
          value={otp} // Pass the code to the input component
          onChange={(value) => setOtp(value)} 
        />
      }
      onVerify={handleVerify}
      onClose={onClose}
      errorMessage={error}
    />
  );
};

export default OTPVerificationPopup;