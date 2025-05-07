import { UserSubscription } from '../types/UserSubscription';
import { fetchUserSubscriptionApi, updateSubscriptionPlanApi } from '../api/userSubscriptionApi';

export const fetchUserSubscription = async (accountId: string): Promise<UserSubscription> => {
  try {
    const response = await fetchUserSubscriptionApi(accountId);
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to fetch user subscription');
    }
    return response.data;
  } catch (error) {
    console.error('Error in user subscription service:', error);
    throw error;
  }
};

export const updateSubscriptionPlan = async (
  accountId: string,
  planName: string,
  paymentMethodId?: string
): Promise<UserSubscription> => {
  try {
    const response = await updateSubscriptionPlanApi(accountId, planName, paymentMethodId);
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to update subscription plan');
    }
    return response.data;
  } catch (error) {
    console.error('Error updating subscription plan:', error);
    throw error;
  }
}; 