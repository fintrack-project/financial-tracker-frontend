import axios from 'axios';
import { LoginRequest, RegisterRequest } from '../types/Requests';

export const loginUser = async (loginData: LoginRequest): Promise<string> => {
  try {
    const response = await axios.post('/api/user/login', loginData, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true, // Include cookies for session-based authentication
    });

    return 'Login successful!';
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Login failed.');
    }
    throw new Error('An unknown error occurred during login.');
  }
};

export const registerUser = async (registerData: RegisterRequest): Promise<void> => {
  try {
    // Step 1: Register the user
    const registerResponse = await axios.post('/api/user/register', registerData);
    console.log('User registered successfully');

    // Step 2: Create an account for the registered user
    const createAccountResponse = await axios.post('/api/accounts/create', null, {
      params: { userId: registerData.userId },
    });
    console.log('Account created successfully:', createAccountResponse.data);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'An error occurred during registration.');
    }
    throw new Error('An unknown error occurred during registration.');
  }
};

export const verifyEmail = async (token: string): Promise<void> => {
  try {
    // Send a POST request to the backend to verify the email using the token
    await axios.post('/api/user/verify-email', { token });
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
    await axios.post('/api/user/send-email-verification', {
      accountId,
      email,
    });
    console.log('Email verification request sent successfully.');
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to send email verification.');
    }
    throw new Error('An unknown error occurred while sending email verification.');
  }
};