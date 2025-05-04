import axios from 'axios';
import {
  fetchUserDetailsApi,
  updateUserPhoneApi,
  updateUserAddressApi,
  updateUserEmailApi,
  updateTwoFactorStatusApi,
} from '../api/userApi';
import { UserDetails } from '../types/UserDetails';

export const fetchUserDetails = async (accountId: string): Promise<UserDetails> => {
  try {
    const response = await fetchUserDetailsApi(accountId);
    return response.data;
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
    await updateUserPhoneApi(accountId, phone, countryCode);
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
    await updateUserAddressApi(accountId, address);
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
    await updateUserEmailApi(accountId, email);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to update email.');
    }
    throw new Error('An unknown error occurred while updating the email.');
  }
};

// Update user's password


// Update user's 2FA status
export const updateTwoFactorStatus = async (accountId: string, enabled: boolean): Promise<void> => {
  try {
    await updateTwoFactorStatusApi(accountId, enabled);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to update 2FA status.');
    }
    throw new Error('An unknown error occurred while updating the 2FA status.');
  }
}