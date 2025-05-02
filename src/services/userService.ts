import axios from 'axios';

export interface UserDetails {
  userId: string;
  password: string;
  email: string;
  phone: string | null;
  address: string | null;
  accountTier: string;
  subscriptionStartDate: string | null;
  subscriptionEndDate: string | null;
  isActiveSubscription: boolean;
  paymentMethod: string | null;
  billingAddress: string | null;
  lastPaymentDate: string | null;
  nextBillingDate: string | null;
  paymentStatus: string | null;
  timezone: string | null;
  twoFactorEnabled: boolean;
  lastLogin: string | null;
  failedLoginAttempts: number;
  accountLocked: boolean;
  signupDate: string;
  lastActivityDate: string | null;
  storageLimit: number;
  apiUsageLimit: number;
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