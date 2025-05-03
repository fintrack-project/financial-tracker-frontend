import React from 'react';
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
  return (
    <VerificationPopup
      title="Phone Verification"
      instructions="Please enter the 6-digit code sent to your phone."
      customInput={<SixDigitInput onChange={(value) => console.log('Code:', value)} />}
      onVerify={onVerify} // Pass the verify callback
      onResend={onResend} // Pass the resend callback
      onClose={onClose} // Pass the close callback
    />
  );
};

export default PhoneVerificationPopup;