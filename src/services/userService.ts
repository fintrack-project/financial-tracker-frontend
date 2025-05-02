import axios from 'axios';
import { UserDetails } from '../types/UserDetails';

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