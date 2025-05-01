import axios from 'axios';

export const registerUser = async (accountId : string): Promise<string[]> => {
  try {
    const userDataResponse = await axios.post('/api/user/fetch', {
      params: { accountId },
    });

    return userDataResponse.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'An error occurred during registration.');
    }
    throw new Error('An unknown error occurred during registration.');
  }
};