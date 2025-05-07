import { updateSubscriptionApi, getSubscriptionStatusApi } from '../api/subscriptionApi';
import { UpdateSubscriptionRequest, SubscriptionResponse } from '../types/Subscription';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const updateSubscription = async (data: UpdateSubscriptionRequest): Promise<SubscriptionResponse> => {
  try {
    if (!data.accountId) {
      throw new Error('Account ID is required to update subscription');
    }
    
    const response = await updateSubscriptionApi(data);
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to update subscription');
    }
    return response.data;
  } catch (error) {
    console.error('Error updating subscription:', error);
    throw error;
  }
};

export const getSubscriptionStatus = async (subscriptionId: string): Promise<SubscriptionResponse> => {
  try {
    const response = await getSubscriptionStatusApi(subscriptionId);
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to get subscription status');
    }
    return response.data;
  } catch (error) {
    console.error('Error getting subscription status:', error);
    throw error;
  }
}; 