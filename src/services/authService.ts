import { loginApi, registerApi, requestPasswordResetApi, validateResetTokenApi, resetPasswordApi } from '../api/authApi';
import { sendEmailVerificationApi, verifyEmailApi, checkEmailVerifiedApi } from '../api/emailApi';
import { sendPhoneVerifiedApi } from '../api/phoneApi';
import { LoginRequest, RegisterRequest } from '../types/Requests';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from '../config/firebaseConfig'; // Ensure `auth` is correctly initialized
import UserSession from '../utils/UserSession';

export const loginUser = async (loginData: LoginRequest): Promise<void> => {
  console.log('Login request data:', loginData);
  const response = await loginApi(loginData);
  console.log('Login response:', response);

  if (!response.success) {
    throw new Error(response.message || 'Login failed.');
  }

  const authData = response.data;
  if (!authData) {
    throw new Error('Login failed: No data received.');
  }

  const token = authData.token;
  if (!token) {
    throw new Error('Login failed: No token received.');
  }

  // Store the token in sessionStorage
  sessionStorage.setItem('authToken', token);
  console.log('Login successful! Token stored in sessionStorage.');
};

export const logoutUser = (): void => {
  sessionStorage.removeItem('authToken');
  console.log('User logged out. Token removed from sessionStorage.');

  // Clear the UserSession singleton
  const session = UserSession.getInstance();
  session.logout();
  console.log('User session cleared.');
};

export const registerUser = async (registerData: RegisterRequest): Promise<void> => {
  try {
    console.log('🔄 Starting user registration process:', { email: registerData.email });
    
    // Register the user (this now handles user creation, account creation, and subscription setup)
    console.log('📝 Calling register API...');
    const registerResponse = await registerApi(registerData);
    console.log('✅ Register API response:', {
      success: registerResponse.success,
      message: registerResponse.message,
      data: registerResponse.data
    });

    if (!registerResponse.success) {
      console.error('❌ Registration failed:', registerResponse.message);
      throw new Error(registerResponse.message || 'Registration failed.');
    }
    console.log('👤 User registered successfully:', registerResponse.data);
  } catch (error) {
    console.error('❌ Registration process failed:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack
      });
    }
    throw error;
  }
};

export const verifyEmail = async (token: string): Promise<void> => {
  try {
    const response = await verifyEmailApi(token);
    if (!response.success) {
      throw new Error(response.message || 'Email verification failed.');
    }
    console.log('Email verified successfully.');
  } catch (error) {
    console.error('Email verification error:', error);
    throw error;
  }
};

// Password reset request service
export const requestPasswordReset = async (identifier: string): Promise<void> => {
  try {
    const response = await requestPasswordResetApi(identifier);
    if (!response.success) {
      throw new Error(response.message || 'Failed to request password reset.');
    }
    console.log('Password reset request sent successfully.');
  } catch (error) {
    console.error('Password reset request error:', error);
    throw error;
  }
};

// Validate password reset token service
export const validateResetToken = async (token: string): Promise<boolean> => {
  try {
    const response = await validateResetTokenApi(token);
    if (!response.success) {
      throw new Error(response.message || 'Invalid or expired reset token.');
    }
    console.log('Reset token validation successful.');
    return true;
  } catch (error) {
    console.error('Reset token validation error:', error);
    return false;
  }
};

// Reset password with token service
export const resetPassword = async (token: string, newPassword: string): Promise<void> => {
  try {
    const response = await resetPasswordApi(token, newPassword);
    if (!response.success) {
      throw new Error(response.message || 'Failed to reset password.');
    }
    console.log('Password reset successful.');
  } catch (error) {
    console.error('Password reset error:', error);
    throw error;
  }
};

export const checkEmailVerified = async (accountId: string): Promise<boolean> => {
  try {
    const response = await checkEmailVerifiedApi(accountId);
    if (!response.success) {
      throw new Error(response.message || 'Failed to check email verification status.');
    }
    console.log('Email verification status checked successfully.');
    return true;
  } catch (error) {
    console.error('Email verification check error:', error);
    throw error;
  }
};

export const sendEmailVerification = async (accountId: string, email: string): Promise<void> => {
  try {
    const response = await sendEmailVerificationApi(accountId, email);
    if (!response.success) {
      throw new Error(response.message || 'Failed to send email verification.');
    }
    console.log('Email verification request sent successfully.');
  } catch (error) {
    console.error('Email verification send error:', error);
    throw error;
  }
};

export const sendSMSVerification = async (phoneNumber: string): Promise<void> => {
  try {
    if (window.location.hostname === 'localhost') {
      // Generate a random 6-digit verification code
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

      // Mock confirmationResult for Emulator
      window.confirmationResult = {
        confirm: async (inputCode: string) => {
          if (inputCode === verificationCode) {
            return { user: { phoneNumber } }; // Mock user object
          } else {
            throw new Error('Invalid verification code.');
          }
        },
      };

      console.log(`Mock SMS sent to ${phoneNumber}. Use code: ${verificationCode}`);
      return;
    }

    // Set up reCAPTCHA verifier
    const recaptchaVerifier = new RecaptchaVerifier(
      auth,
      'recaptcha-container', // ID of the reCAPTCHA container
      {
        size: 'invisible', // Invisible reCAPTCHA
        callback: (response: any) => {
          console.log('reCAPTCHA verified:', response);
        },
      }
    );

    // Send SMS
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
    console.log('SMS sent successfully:', confirmationResult);

    // Store confirmationResult for later verification
    window.confirmationResult = confirmationResult;
  } catch (error) {
    console.error('Error sending SMS:', error);
    throw new Error('Failed to send SMS verification code.');
  }
};

export const verifySMSCode = async (verificationCode: string, accountId: string): Promise<void> => {
  try {
    const confirmationResult = window.confirmationResult;
    if (!confirmationResult) {
      throw new Error('No confirmation result found. Please resend the SMS.');
    }

    const result = await confirmationResult.confirm(verificationCode);
    console.log('Phone number verified successfully:', result.user.phoneNumber);

    // Send a request to the backend to update the phone verification status
    const response = await sendPhoneVerifiedApi(accountId);
    if (!response.success) {
      throw new Error(response.message || 'Failed to update phone verification status.');
    }
    console.log('Phone verification status updated successfully in the backend.');
  } catch (error) {
    console.error('Error verifying SMS code:', error);
    throw error;
  }
};