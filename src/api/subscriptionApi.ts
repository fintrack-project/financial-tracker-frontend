import { apiClient } from '../utils/apiClient';
import { ApiResponse } from '../types/ApiTypes';
import { CreateSubscriptionRequest, SubscriptionResponse } from '../types/Subscription';

export const createSubscriptionApi = async (data: CreateSubscriptionRequest): Promise<ApiResponse<SubscriptionResponse>> => {
  try {
    const response = await apiClient.post<ApiResponse<SubscriptionResponse>>('/api/subscriptions/create', data);
    return response.data;
  } catch (error) {
    console.error('Error creating subscription:', error);
    throw error;
  }
};

export const getSubscriptionStatusApi = async (subscriptionId: string): Promise<ApiResponse<SubscriptionResponse>> => {
  try {
    const response = await apiClient.get<ApiResponse<SubscriptionResponse>>(`/api/subscriptions/${subscriptionId}/status`);
    return response.data;
  } catch (error) {
    console.error('Error getting subscription status:', error);
    throw error;
  }
}; 