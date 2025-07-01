import React, { useState, useEffect } from 'react';
import VerificationPopup from './VerificationPopup'; // Import the generalized component
import SixDigitInput from '../shared/components/InputField/SixDigitInput'; // Import the six-digit input component

interface PhoneVerificationPopupProps {
  onClose: () => void; // Callback to close the popup
  onVerify: (verificationCode: string) => Promise<boolean>; // Callback when verification is successful
  onResend: () => void; // Callback to resend the SMS
}

const PhoneVerificationPopup: React.FC<PhoneVerificationPopupProps> = ({
  onClose,
  onVerify,
  onResend,
}) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState(''); // Track the entered code

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage(null); // Clear the error message after 3 seconds
      }, 3000);
      return () => clearTimeout(timer); // Cleanup the timer on unmount
    }
  }, [errorMessage]);

  const handleVerify = async () => {
    if (!verificationCode.trim()) {
      setErrorMessage('Please enter a verification code.');
      return;
    }

    const isVerified = await onVerify(verificationCode); // Call the parent verification function
    if (!isVerified) {
      setErrorMessage('Invalid verification code. Please try again.');
    }
  };

  return (
    <VerificationPopup
      title="Phone Verification"
      instructions="Please enter the 6-digit code sent to your phone."
      customInput={
        <SixDigitInput 
          value={verificationCode} // Pass the code to the input component
          onChange={(value) => setVerificationCode(value)} 
        />}
      onVerify={handleVerify} // Pass the verify callback
      onResend={() => {
        setErrorMessage(null); // Clear any previous error messages
        setVerificationCode(''); // Clear the input field
        onResend(); // Resend the verification code
      }} // Pass the resend callback
      onClose={onClose} // Pass the close callback
      errorMessage={errorMessage} // Pass the error message to the popup
    />
  );
};

export default PhoneVerificationPopup;