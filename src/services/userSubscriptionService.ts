import { UserSubscription } from '../types/UserSubscription';
import { fetchUserSubscriptionApi, updateSubscriptionApi } from '../api/userSubscriptionApi';
import { SubscriptionUpdateResponse } from '../types/Subscription';

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

export const updateSubscription = async (
  accountId: string,
  planId: string,
  paymentMethodId?: string,
  returnUrl?: string
): Promise<SubscriptionUpdateResponse> => {
  try {
    const response = await updateSubscriptionApi(
      accountId,
      planId,
      paymentMethodId || '',
      returnUrl || `${window.location.origin}/subscription/complete`
    );
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to update subscription');
    }
    return response.data;
  } catch (error) {
    console.error('Error updating subscription:', error);
    throw error;
  }
}; 