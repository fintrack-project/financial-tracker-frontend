import React from 'react';
import VerificationPopup from './VerificationPopup';

interface EmailVerificationPopupProps {
  onClose: () => void; // Callback to close the popup
  onResend: () => void; // Callback to resend the verification email
}

const EmailVerificationPopup: React.FC<EmailVerificationPopupProps> = ({
  onClose,
  onResend
}) => {
  return (
    <VerificationPopup
      title="Email Verification"
      instructions="A verification email has been sent to your email address. Please check your inbox."
      customInput={null} // No input field for email verification
      onResend={onResend}
      onClose={onClose}
    />
  );
};

export default EmailVerificationPopup;