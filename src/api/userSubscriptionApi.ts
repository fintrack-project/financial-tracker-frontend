import axios from 'axios';
import { UserSubscription } from '../types/UserSubscription';

export const fetchUserSubscriptionApi = async (accountId: string): Promise<UserSubscription> => {
  try {
    console.log('Making API call to fetch subscription with accountId:', accountId);
    const requestBody = {
      accountId: accountId
    };
    console.log('Request body:', requestBody);
    const response = await axios.post('/api/user/subscriptions/fetch', requestBody);
    console.log('Subscription API response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error in fetchUserSubscriptionApi:', error);
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.response?.data || 'Failed to fetch user subscription';
      console.error('Error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
      throw new Error(errorMessage);
    }
    throw error;
  }
};

export const updateSubscriptionPlanApi = async (
  accountId: string, 
  planName: string, 
  paymentMethodId?: string
): Promise<UserSubscription> => {
  try {
    console.log('Making API call to update subscription plan:', { accountId, planName, paymentMethodId });
    const requestBody = {
      accountId,
      planName,
      paymentMethodId
    };
    console.log('Request body:', requestBody);
    const response = await axios.post('/api/user/subscriptions/update', requestBody);
    console.log('Update subscription API response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error in updateSubscriptionPlanApi:', error);
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.response?.data || 'Failed to update subscription plan';
      console.error('Error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
      throw new Error(errorMessage);
    }
    throw error;
  }
}; 