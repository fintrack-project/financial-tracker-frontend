import axios from 'axios';
import { LoginRequest } from '../types/Requests';

export const loginApi = async (loginData: LoginRequest): Promise<{ success: boolean; message?: string; token?: string }> => {
  try {
    const response = await axios.post('/api/user/login', loginData);

    return response.data; // Return the backend response directly
  } catch (error: any) {
    if (error.response && error.response.data) {
      // Extract the error message from the backend response
      return {
        success: false,
        message: error.response.data.message || 'An unexpected error occurred.',
      };
    }

    // Handle unexpected errors
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again later.',
    };
  }
};

export const registerApi = async (registerData: { userId: string; email: string; password: string }) => {
  return axios.post('/api/user/register', registerData);
};