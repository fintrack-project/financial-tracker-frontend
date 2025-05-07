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
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to fetch user details');
    }

    // Ensure all required fields are present
    const userDetails = response.data;
    if (!userDetails.userId || !userDetails.accountId) {
      throw new Error('Invalid user details received');
    }

    return userDetails;
  } catch (error) {
    console.error('Error fetching user details:', error);
    throw new Error('Failed to fetch user details');
  }
};

// Update user's phone number
export const updateUserPhone = async (accountId: string, phone: string, countryCode: string): Promise<void> => {
  try {
    const response = await updateUserPhoneApi(accountId, phone, countryCode);
    if (!response.success) {
      throw new Error(response.message || 'Failed to update phone number');
    }
  } catch (error) {
    console.error('Error updating phone number:', error);
    throw new Error('Failed to update phone number');
  }
};

// Update user's address
export const updateUserAddress = async (accountId: string, address: string): Promise<void> => {
  try {
    const response = await updateUserAddressApi(accountId, address);
    if (!response.success) {
      throw new Error(response.message || 'Failed to update address');
    }
  } catch (error) {
    console.error('Error updating address:', error);
    throw new Error('Failed to update address');
  }
};

// Update user's email
export const updateUserEmail = async (accountId: string, email: string): Promise<void> => {
  try {
    const response = await updateUserEmailApi(accountId, email);
    if (!response.success) {
      throw new Error(response.message || 'Failed to update email');
    }
  } catch (error) {
    console.error('Error updating email:', error);
    throw new Error('Failed to update email');
  }
};

// Update user's 2FA status
export const updateTwoFactorStatus = async (accountId: string, enabled: boolean): Promise<void> => {
  try {
    const response = await updateTwoFactorStatusApi(accountId, enabled);
    if (!response.success) {
      throw new Error(response.message || 'Failed to update 2FA status');
    }
  } catch (error) {
    console.error('Error updating 2FA status:', error);
    throw new Error('Failed to update 2FA status');
  }
};