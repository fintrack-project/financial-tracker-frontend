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

// Update user's phone number
export const updateUserPhone = async (accountId: string, phone: string, countryCode: string): Promise<void> => {
  try {
    await axios.post('/api/user/update-phone', {
      accountId,
      phone,
      countryCode
    });
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to update phone number.');
    }
    throw new Error('An unknown error occurred while updating the phone number.');
  }
};

// Update user's address
export const updateUserAddress = async (accountId: string, address: string): Promise<void> => {
  try {
    await axios.post('/api/user/update-address', {
      accountId,
      address,
    });
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to update address.');
    }
    throw new Error('An unknown error occurred while updating the address.');
  }
};

// Update user's email
export const updateUserEmail = async (accountId: string, email: string): Promise<void> => {
  try {
    await axios.post('/api/user/update-email', {
      accountId,
      email,
    });
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to update email.');
    }
    throw new Error('An unknown error occurred while updating the email.');
  }
};