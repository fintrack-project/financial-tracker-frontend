import { SubscriptionDetails } from '../types/SubscriptionPlan';
import { fetchSubscriptionDetailsApi } from '../api/subscriptionDetailsApi';

/**
 * Fetch subscription details including the plan information
 * @param accountId The user's account ID
 * @returns Promise containing subscription and plan details
 */
export const fetchSubscriptionDetails = async (accountId: string): Promise<SubscriptionDetails> => {
  try {
    const response = await fetchSubscriptionDetailsApi(accountId);
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to fetch subscription details');
    }
    return response.data;
  } catch (error) {
    console.error('Error in subscription details service:', error);
    throw error;
  }
}; 