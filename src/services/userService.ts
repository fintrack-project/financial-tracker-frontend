import axios from 'axios';

export interface UserDetails {
  userId: string;
  password: string;
  email: string;
  phone: string | null; // Phone can be nullable
  address: string | null; // Address can be nullable
}

export const fetchUserDetails = async (accountId: string): Promise<UserDetails> => {
  try {
    const userDataResponse = await axios.post('/api/user/fetch', {
      accountId, // Send accountId directly in the request body
    });

    return userDataResponse.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'An error occurred during registration.');
    }
    throw new Error('An unknown error occurred during registration.');
  }
};