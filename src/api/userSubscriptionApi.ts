import { apiClient } from '../utils/apiClient';
import { ApiResponse } from '../types/ApiTypes';
import { UserSubscription } from '../types/UserSubscription';
import { SubscriptionUpdateResponse, SubscriptionPlanType } from '../types/Subscription';
import { UserSubscriptionDetailsResponse } from '../types/SubscriptionPlan';

export const fetchUserSubscriptionApi = async (accountId: string): Promise<ApiResponse<UserSubscription>> => {
  try {
    const response = await apiClient.post<ApiResponse<UserSubscription>>('/api/user/subscriptions/fetch', { accountId });
    return response.data;
  } catch (error) {
    console.error('Error fetching user subscription:', error);
    throw error;
  }
};

export const fetchSubscriptionDetailsApi = async (accountId: string): Promise<ApiResponse<UserSubscriptionDetailsResponse>> => {
  try {
    const response = await apiClient.post<ApiResponse<UserSubscriptionDetailsResponse>>('/api/user/subscriptions/details', { accountId });
    return response.data;
  } catch (error) {
    console.error('Error fetching subscription details:', error);
    throw error;
  }
};

export const updateSubscriptionApi = async (
  accountId: string,
  planName: string,
  paymentMethodId: string,
  returnUrl: string
): Promise<ApiResponse<SubscriptionUpdateResponse>> => {
  try {
    const response = await apiClient.post<ApiResponse<SubscriptionUpdateResponse>>('/api/user/subscriptions/update', {
      accountId,
      planName,
      paymentMethodId,
      returnUrl
    });
    return response.data;
  } catch (error) {
    console.error('Error updating subscription:', error);
    throw error;
  }
};

export const confirmSubscriptionPaymentApi = async (
  paymentIntentId: string,
  subscriptionId: string
): Promise<ApiResponse<SubscriptionUpdateResponse>> => {
  try {
    const response = await apiClient.post<ApiResponse<SubscriptionUpdateResponse>>(
      '/api/user/subscriptions/confirm-payment',
      {
        paymentIntentId,
        subscriptionId
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error confirming payment:', error);
    throw error;
  }
};

export const getAvailablePlanTypesApi = async (): Promise<ApiResponse<SubscriptionPlanType[]>> => {
  try {
    const response = await apiClient.get<ApiResponse<SubscriptionPlanType[]>>('/api/user/subscriptions/plan-types');
    return response.data;
  } catch (error) {
    console.error('Error fetching plan types:', error);
    throw error;
  }
};