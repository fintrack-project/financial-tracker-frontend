import axios from 'axios';

export interface LoginRequest {
  userId: string;
  password: string;
}

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