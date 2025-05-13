import { UserSubscription } from '../types/UserSubscription';
import { fetchUserSubscriptionApi, upgradeSubscriptionApi } from '../api/userSubscriptionApi';
import { SubscriptionUpdateResponse } from '../types/SubscriptionPlan';

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

export const upgradeSubscription = async (
  accountId: string,
  planId: string,
  paymentMethodId?: string,
  returnUrl?: string
): Promise<SubscriptionUpdateResponse> => {
  try {
    const response = await upgradeSubscriptionApi(
      accountId,
      planId,
      paymentMethodId || '',
      returnUrl || window.location.origin + '/subscription/confirm'
    );
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to upgrade subscription');
    }
    return response.data;
  } catch (error) {
    console.error('Error upgrading subscription:', error);
    throw error;
  }
}; 