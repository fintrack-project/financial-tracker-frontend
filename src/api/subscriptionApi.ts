import { apiClient } from '../utils/apiClient';
import { ApiResponse } from '../types/ApiTypes';
import { UpdateSubscriptionRequest, SubscriptionResponse } from '../types/Subscription';

export const updateSubscriptionApi = async (data: UpdateSubscriptionRequest): Promise<ApiResponse<SubscriptionResponse>> => {
  try {
    const response = await apiClient.post<ApiResponse<SubscriptionResponse>>('/api/user/subscriptions/update', data);
    return response.data;
  } catch (error) {
    console.error('Error creating subscription:', error);
    throw error;
  }
};

export const getSubscriptionStatusApi = async (subscriptionId: string): Promise<ApiResponse<SubscriptionResponse>> => {
  try {
    const response = await apiClient.get<ApiResponse<SubscriptionResponse>>(`/api/user/subscription-plans/${subscriptionId}/status`);
    return response.data;
  } catch (error) {
    console.error('Error getting subscription status:', error);
    throw error;
  }
}; 