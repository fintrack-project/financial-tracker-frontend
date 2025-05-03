import React, { useState, useEffect } from 'react';
import VerificationPopup from './VerificationPopup'; // Import the generalized component
import SixDigitInput from '../components/InputField/SixDigitInput'; // Import the six-digit input component

interface PhoneVerificationPopupProps {
  onClose: () => void; // Callback to close the popup
  onVerify: (code: string) => void; // Callback when verification is successful
  onResend: () => void; // Callback to resend the SMS
}

const PhoneVerificationPopup: React.FC<PhoneVerificationPopupProps> = ({
  onClose,
  onVerify,
  onResend,
}) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [code, setCode] = useState<string>(''); // Track the entered code

  useEffect(() => {
    if (errorMessage) {
      setTimeout(() => {
        setErrorMessage(null); // Clear the error message after 3 seconds
      }, 3000);
    }
  }, [code, errorMessage]);

  const handleVerify = async () => {
    try {
      // Call the onVerify callback with the entered code
      await onVerify(code);
      alert('Phone number verified successfully!');
      onClose(); // Close the popup on successful verification
    } catch (error) {
      console.error('Verification failed:', error);
      setErrorMessage('Invalid code. Please try again.'); // Display error message
      setCode(''); // Clear the input field
    }
  };

  return (
    <VerificationPopup
      title="Phone Verification"
      instructions="Please enter the 6-digit code sent to your phone."
      customInput={
        <SixDigitInput 
          value={code} // Pass the code to the input component
          onChange={(value) => setCode(value)} 
        />}
      onVerify={handleVerify} // Pass the verify callback
      onResend={() => {
        setErrorMessage(null); // Clear any previous error messages
        setCode(''); // Clear the input field
        onResend(); // Resend the verification code
      }} // Pass the resend callback
      onClose={onClose} // Pass the close callback
      errorMessage={errorMessage} // Pass the error message to the popup
    />
  );
};

export default PhoneVerificationPopup;