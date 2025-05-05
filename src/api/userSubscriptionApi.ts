import axios from 'axios';
import { UserSubscription } from '../types/UserSubscription';

export const fetchUserSubscriptionApi = async (accountId: string): Promise<UserSubscription> => {
  try {
    const response = await axios.post('/api/user/subscriptions/fetch', { accountId });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to fetch user subscription');
    }
    throw error;
  }
}; 