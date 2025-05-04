import { useState } from 'react';
import { sendSMSVerification, verifySMSCode, sendEmailVerification, checkEmailVerified } from '../services/authService';
import { getCountryCallingCode, CountryCode } from 'libphonenumber-js';
import { UserDetails } from '../types/UserDetails'; // Adjust the import path as necessary

const useVerification = (
  accountId: string,
  userDetails: UserDetails | null,
  setUserDetails: React.Dispatch<React.SetStateAction<any>>
) => {
  const [showPopup, setShowPopup] = useState<'phone' | 'email' | null>(null);

  const sendVerification = async (type: 'phone' | 'email', phoneNumber?: string) => {
    try {
      if (type === 'phone') {
        const fullPhoneNumber = phoneNumber || `+${getCountryCallingCode(userDetails?.countryCode as CountryCode || 'US')}${userDetails?.phone}`;
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

  const verifyCode = async (verificationCode: string): Promise<boolean> => {
    try {
      if (showPopup === 'phone') {
        console.log(`Verifying phone code: ${verificationCode}`);
        await verifySMSCode(verificationCode, accountId);
        setUserDetails((prev: any) => ({
          ...prev,
          phoneVerified: true,
        }));
        console.log('Phone number verified successfully!');
        setShowPopup(null); // Close the popup on success
        return true; // Indicate success
      } else if (showPopup === 'email') {
        console.log('Checking email verification status from backend...');
        const isVerified = await checkEmailVerified(accountId); // Call the new API
        if (isVerified) {
          console.log('Email verified successfully!');
          setShowPopup(null); // Close the popup on success
          return true; // Indicate success
        } else {
          console.log('Email verification is not complete. Please check your inbox.');
          return false; // Indicate failure
        }
      }
    } catch (error) {
      console.error(`Failed to verify ${showPopup} code:`, error);
      return false; // Indicate failure
    }

    return false; // Default return value
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