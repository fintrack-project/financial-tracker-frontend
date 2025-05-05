import { UserSubscription } from '../types/UserSubscription';
import { fetchUserSubscriptionApi, updateSubscriptionPlanApi } from '../api/userSubscriptionApi';

export const fetchUserSubscription = async (accountId: string): Promise<UserSubscription> => {
  try {
    return await fetchUserSubscriptionApi(accountId);
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
    return await updateSubscriptionPlanApi(accountId, planName, paymentMethodId);
  } catch (error) {
    console.error('Error updating subscription plan:', error);
    throw error;
  }
}; 