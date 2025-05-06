import { SubscriptionDetails } from '../types/SubscriptionPlan';
import { fetchSubscriptionDetailsApi } from '../api/subscriptionDetailsApi';

/**
 * Fetch subscription details including the plan information
 * @param accountId The user's account ID
 * @returns Promise containing subscription and plan details
 */
export const fetchSubscriptionDetails = async (accountId: string): Promise<SubscriptionDetails> => {
  try {
    return await fetchSubscriptionDetailsApi(accountId);
  } catch (error) {
    console.error('Error in subscription details service:', error);
    throw error;
  }
}; 