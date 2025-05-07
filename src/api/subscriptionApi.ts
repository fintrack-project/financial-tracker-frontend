import { apiClient } from '../utils/apiClient';

export interface CreateSubscriptionRequest {
  planId: string;
  paymentMethodId: string;
}

export interface SubscriptionResponse {
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