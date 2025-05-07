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

export const finalizeSubscription = async (
  subscriptionId: string,
  stripe: any,
  maxAttempts = 10,
  intervalMs = 2000
): Promise<SubscriptionResponse> => {
  let attempts = 0;
  
  while (attempts < maxAttempts) {
    try {
      const status = await getSubscriptionStatus(subscriptionId);
      
      // If subscription is active, we're done
      if (status.status === 'active') {
        return status;
      }
      
      // If payment is required and we have a client secret, confirm the payment
      if (status.paymentRequired && status.clientSecret && stripe) {
        const { error } = await stripe.confirmCardPayment(status.clientSecret);
        if (error) {
          throw new Error(error.message);
        }
        // After confirming payment, get the status again
        continue;
      }
      
      // If still pending, wait and try again
      if (status.status === 'pending') {
        await new Promise(resolve => setTimeout(resolve, intervalMs));
        attempts++;
        continue;
      }
      
      // If failed, throw error
      if (status.status === 'failed') {
        throw new Error('Subscription payment failed');
      }
      
      return status;
    } catch (error) {
      console.error('Error finalizing subscription:', error);
      throw error;
    }
  }
  
  throw new Error('Timeout waiting for subscription to finalize');
};

// ... existing code ...