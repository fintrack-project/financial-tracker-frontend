import { apiClient } from '../utils/apiClient';
import { UserSubscription } from '../types/UserSubscription';
import { ApiResponse } from 'types/ApiTypes';

export const fetchUserSubscriptionApi = async (accountId: string): Promise<ApiResponse<UserSubscription>> => {
  try {
    console.log('Making API call to fetch subscription with accountId:', accountId);
    const requestBody = {
      accountId: accountId
    };
    console.log('Request body:', requestBody);
    const response = await apiClient.post<ApiResponse<UserSubscription>>('/api/user/subscriptions/fetch', requestBody);
    console.log('Subscription API response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error in fetchUserSubscriptionApi:', error);
    throw error;
  }
};

export const updateSubscriptionPlanApi = async (
  accountId: string, 
  planName: string, 
  paymentMethodId?: string
): Promise<ApiResponse<UserSubscription>> => {
  try {
    console.log('Making API call to update subscription plan:', { accountId, planName, paymentMethodId });
    const requestBody = {
      accountId,
      planName,
      paymentMethodId
    };
    console.log('Request body:', requestBody);
    const response = await apiClient.post<ApiResponse<UserSubscription>>('/api/user/subscriptions/update', requestBody);
    console.log('Update subscription API response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error in updateSubscriptionPlanApi:', error);
    throw error;
  }
}; 