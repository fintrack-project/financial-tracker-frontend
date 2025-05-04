import { useState } from 'react';
import { sendSMSVerification, verifySMSCode, sendEmailVerification } from '../services/authService';
import { getCountryCallingCode, CountryCode } from 'libphonenumber-js';
import { UserDetails } from '../types/UserDetails'; // Adjust the import path as necessary

const useVerification = (
  accountId: string,
  userDetails: UserDetails | null,
  setUserDetails: React.Dispatch<React.SetStateAction<any>>
) => {
  const [showPopup, setShowPopup] = useState<'phone' | 'email' | null>(null);

  const sendVerification = async (type: 'phone' | 'email') => {
    try {
      if (type === 'phone') {
        const fullPhoneNumber = `+${getCountryCallingCode(userDetails?.countryCode as CountryCode || 'US')}${userDetails?.phone}`;
        console.log(`Sending SMS verification to: ${fullPhoneNumber}`);
        await sendSMSVerification(fullPhoneNumber);
        setShowPopup('phone');
      } else if (type === 'email') {
        console.log(`Sending email verification to: ${userDetails?.email}`);
        await sendEmailVerification(accountId, userDetails?.email || '');
        setShowPopup('email');
      }
    } catch (error) {
      console.error(`Failed to send ${type} verification:`, error);
      alert(`Failed to send ${type} verification. Please try again.`);
    }
  };

  const resendVerification = async () => {
    try {
      if (showPopup === 'phone') {
        const fullPhoneNumber = `+${getCountryCallingCode(userDetails?.countryCode as CountryCode || 'US')}${userDetails?.phone}`;
        console.log(`Resending SMS verification to: ${fullPhoneNumber}`);
        await sendSMSVerification(fullPhoneNumber);
        alert('Verification SMS has been resent.');
      } else if (showPopup === 'email') {
        console.log(`Resending email verification to: ${userDetails?.email}`);
        await sendEmailVerification(accountId, userDetails?.email || '');
        alert('Verification email has been resent.');
      }
    } catch (error) {
      console.error(`Failed to resend ${showPopup} verification:`, error);
      alert(`Failed to resend ${showPopup} verification. Please try again.`);
    }
  };

  const verifyCode = async (verificationCode: string) => {
    try {
      if (showPopup === 'phone') {
        console.log(`Verifying phone code: ${verificationCode}`);
        await verifySMSCode(verificationCode, accountId);
        setUserDetails((prev: any) => ({
          ...prev,
          phoneVerified: true,
        }));
        alert('Phone number verified successfully!');
        setShowPopup(null);
      } else if (showPopup === 'email') {
        if (userDetails?.emailVerified) {
          alert('Email verified successfully!');
          setShowPopup(null);
        } else {
          alert('Email verification is not complete. Please check your inbox.');
        }
      }
    } catch (error) {
      console.error(`Failed to verify ${showPopup} code:`, error);
      alert(`Invalid verification code. Please try again.`);
    }
  };

  const closePopup = () => {
    setShowPopup(null);
  };

  return {
    showPopup,
    sendVerification,
    resendVerification,
    verifyCode,
    closePopup,
  };
};

export default useVerification;