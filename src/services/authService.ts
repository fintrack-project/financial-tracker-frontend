import axios from 'axios';
import { loginApi, registerApi } from '../api/authApi';
import { createAccountApi } from '../api/accountApi';
import { sendEmailVerificationApi, verifyEmailApi } from '../api/emailApi';
import { LoginRequest, RegisterRequest } from '../types/Requests';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from '../config/firebaseConfig'; // Ensure `auth` is correctly initialized
import UserSession from '../utils/UserSession';

export const loginUser = async (loginData: LoginRequest): Promise<void> => {
  try {
    const response = await loginApi(loginData);

    // Extract the token from the response
    const token = response.data?.token;
    if (!token) {
      throw new Error('Login failed: No token received.');
    }

    // Store the token in sessionStorage
    sessionStorage.setItem('authToken', token);

    console.log('Login successful! Token stored in sessionStorage.');
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Login failed.');
    }
    throw new Error('An unknown error occurred during login.');
  }
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
    // Step 1: Register the user
    await registerApi(registerData);
    console.log('User registered successfully');

    // Step 2: Create an account for the registered user
    await createAccountApi(registerData.userId);
    console.log('Account created successfully');
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'An error occurred during registration.');
    }
    throw new Error('An unknown error occurred during registration.');
  }
};

export const verifyEmail = async (token: string): Promise<void> => {
  try {
    await verifyEmailApi(token);
    console.log('Email verified successfully.');
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Email verification failed.');
    }
    throw new Error('An unknown error occurred during email verification.');
  }
};

export const sendEmailVerification = async (accountId: string, email: string): Promise<void> => {
  try {
    await sendEmailVerificationApi(accountId, email);
    console.log('Email verification request sent successfully.');
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to send email verification.');
    }
    throw new Error('An unknown error occurred while sending email verification.');
  }
};

export const sendSMSVerification = async (phoneNumber: string): Promise<void> => {
  try {
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

export const verifySMSCode = async (verificationCode: string): Promise<void> => {
  try {
    const confirmationResult = window.confirmationResult;
    if (!confirmationResult) {
      throw new Error('No confirmation result found. Please resend the SMS.');
    }

    const result = await confirmationResult.confirm(verificationCode);
    console.log('Phone number verified successfully:', result.user.phoneNumber);
  } catch (error) {
    console.error('Error verifying SMS code:', error);
    throw new Error('Failed to verify SMS code.');
  }
};