import { UserSubscription } from '../types/UserSubscription';
import { fetchUserSubscriptionApi } from '../api/userSubscriptionApi';

export const fetchUserSubscription = async (accountId: string): Promise<UserSubscription> => {
  try {
    return await fetchUserSubscriptionApi(accountId);
  } catch (error) {
    console.error('Error in user subscription service:', error);
    throw error;
  }
}; 