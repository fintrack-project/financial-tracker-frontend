import React, { useState } from 'react';
import VerificationPopup from './VerificationPopup';

interface OTPVerificationPopupProps {
  qrCode: string;
  onVerify: (otp: string) => void;
  onClose: () => void;
}

const OTPVerificationPopup: React.FC<OTPVerificationPopupProps> = ({ qrCode, onVerify, onClose }) => {
  const [otp, setOtp] = useState('');

  const handleVerify = () => {
    if (otp.length === 6) {
      onVerify(otp);
    } else {
      alert('Please enter a valid 6-digit OTP.');
    }
  };

  return (
    <VerificationPopup
      title="Two-Factor Authentication"
      instructions="Scan the QR code below with Google Authenticator and enter the 6-digit OTP."
      customInput={
        <>
          <img src={qrCode} alt="QR Code" />
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
            placeholder="Enter OTP"
          />
        </>
      }
      onVerify={handleVerify}
      onClose={onClose}
    />
  );
};

export default OTPVerificationPopup;