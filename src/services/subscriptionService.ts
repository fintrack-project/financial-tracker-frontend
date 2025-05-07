import { createSubscriptionApi, getSubscriptionStatusApi } from '../api/subscriptionApi';

interface CreateSubscriptionRequest {
  planId: string;
  paymentMethodId: string;
}

interface SubscriptionResponse {
  subscriptionId: string;
  status: 'active' | 'pending' | 'failed';
  currentPeriodEnd: string;
  planId: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const createSubscription = async (data: CreateSubscriptionRequest): Promise<SubscriptionResponse> => {
  try {
    const response = await createSubscriptionApi(data);
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to create subscription');
    }
    return response.data;
  } catch (error) {
    console.error('Error creating subscription:', error);
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