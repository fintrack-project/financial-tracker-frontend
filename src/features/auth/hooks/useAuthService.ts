import { verifyPassword } from '../api/passwordApi';
import { verify2FA } from '../api/twoFactorApi';
import { useState } from 'react';

interface AuthServiceOptions {
  accountId: string;
  twoFactorEnabled: boolean;
  onSuccess: () => void; // Callback when authentication succeeds
  onError?: (error: string) => void; // Optional callback for errors
}

export const useAuthService = () => {
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<(() => Promise<void>) | null>(null);

  const authenticate = (options: AuthServiceOptions): 
  { 
    handlePasswordConfirm: (password: string) => Promise<void>; handlePasswordClose: () => void 
  } => {
    const { accountId, twoFactorEnabled, onSuccess, onError } = options;

    // Show the password popup to start the authentication process
    setShowPasswordPopup(true);

    const handlePasswordConfirm = async (password: string) => {
      try {
        // Step 1: Verify Password
        const response = await verifyPassword(accountId, password);
        if (!response.success) {
          throw new Error(response.message || 'Invalid password. Please try again.');
        }

        // Step 2: Handle 2FA if enabled
        if (twoFactorEnabled) {
          setShowPasswordPopup(false); // Close password popup
          setShowOtpPopup(true); // Show OTP popup

          // Store the pending action to execute after OTP verification
          setPendingAction(() => async () => {
            setShowOtpPopup(false); // Close OTP popup
            onSuccess(); // Call the success callback
          });

          return; // Wait for OTP verification
        }

        // Step 3: If no 2FA, directly call success callback
        setShowPasswordPopup(false); // Close password popup
        console.log('Calling onSuccess callback...');
        onSuccess();
        console.log('Authentication process completed successfully.');
      } catch (error: any) {
        console.error('Password authentication failed:', error);
        setPasswordError(error.message || 'Authentication failed. Please try again.');
      }
    };

    const handlePasswordClose = () => {
      setShowPasswordPopup(false);
      setPasswordError(null);
      if (onError) {
        onError('Authentication canceled.');
      }
    };

    // Return handlers for the password popup
    return {
      handlePasswordConfirm,
      handlePasswordClose,
    };
  };

  const verifyOtp = async (accountId: string, otp: string): Promise<void> => {
    try {
      const otpValid = await verify2FA(accountId, otp);
      if (!otpValid.success) {
        throw new Error('Invalid OTP. Please try again.');
      }

      // Execute the pending action after OTP verification
      if (pendingAction) {
        console.log('Executing pending action after OTP verification...');
        await pendingAction();
        setPendingAction(null); // Clear the pending action
      } else {
        console.error('No pending action found after OTP verification.');
      }

      setShowOtpPopup(false); // Close OTP popup only after successful verification
    } catch (error: any) {
      console.error('OTP verification failed:', error);
      setOtpError(error.message || 'Failed to verify OTP. Please try again.');
    }
  };

  const closeOtpPopup = () => {
    setShowOtpPopup(false);
    setOtpError(null);
    setPendingAction(null);
  };

  return {
    authenticate,
    verifyOtp,
    closeOtpPopup,
    showPasswordPopup,
    setShowPasswordPopup,
    passwordError,
    setPasswordError,
    showOtpPopup,
    otpError,
    setOtpError
  };
};