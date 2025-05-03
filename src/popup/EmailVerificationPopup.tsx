import React, { useState } from 'react';
import VerificationPopup from './VerificationPopup';

interface EmailVerificationPopupProps {
  onClose: () => void; // Callback to close the popup
  onResend: () => void; // Callback to resend the verification email
  isEmailVerified: boolean; // Whether the email is verified
}

const EmailVerificationPopup: React.FC<EmailVerificationPopupProps> = ({
  onClose,
  onResend,
  isEmailVerified,
}) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleVerify = () => {
    if (isEmailVerified) {
      onClose(); // Close the popup if the email is verified
    } else {
      setErrorMessage('Email verification is not complete. Please check your inbox.');
    }
  };

  return (
    <VerificationPopup
      title="Email Verification"
      instructions="A verification email has been sent to your email address. Please check your inbox."
      customInput={null} // No input field for email verification
      onVerify={handleVerify}
      onResend={() => {
        setErrorMessage(null); // Clear any previous error messages
        onResend(); // Resend the verification email
      }}
      onClose={onClose}
      errorMessage={errorMessage || undefined} // Pass the error message to the popup
    />
  );
};

export default EmailVerificationPopup;