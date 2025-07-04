import { apiClient } from '../../../shared/utils/apiClient';
import { ApiResponse } from '../../../shared/types/ApiTypes';
import { UserSubscription } from '../types/UserSubscription';
import { SubscriptionUpdateResponse, SubscriptionPlanType } from '../types/SubscriptionPlan';

export const fetchUserSubscriptionApi = async (accountId: string): Promise<ApiResponse<UserSubscription>> => {
  try {
    const response = await apiClient.post<ApiResponse<UserSubscription>>('/api/user/subscriptions/fetch', { accountId });
    return response.data;
  } catch (error) {
    console.error('Error fetching user subscription:', error);
    throw error;
  }
};

export const upgradeSubscriptionApi = async (
  accountId: string,
  planId: string,
  paymentMethodId: string,
  returnUrl?: string | null
): Promise<ApiResponse<SubscriptionUpdateResponse>> => {
  try {
    const response = await apiClient.post<ApiResponse<SubscriptionUpdateResponse>>('/api/user/subscriptions/upgrade', {
      accountId,
      planId,
      paymentMethodId,
      returnUrl
    });
    return response.data;
  } catch (error) {
    console.error('Error upgrading subscription:', error);
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

export const cancelSubscriptionApi = async (
  stripeSubscriptionId: string
): Promise<ApiResponse<void>> => {
  try {
    const response = await apiClient.post<ApiResponse<void>>(`/api/user/subscriptions/cancel`, {
      stripeSubscriptionId
    });
    return response.data;
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    throw error;
  }
};

export const reactivateSubscriptionApi = async (
  stripeSubscriptionId: string
): Promise<ApiResponse<void>> => {
  try {
    const response = await apiClient.post<ApiResponse<void>>(`/api/user/subscriptions/reactivate`, {
      stripeSubscriptionId
    });
    return response.data;
  } catch (error) {
    console.error('Error reactivating subscription:', error);
    throw error;
  }
};

export const downgradeSubscriptionApi = async (
  accountId: string,
  planId: string
): Promise<ApiResponse<SubscriptionUpdateResponse>> => {
  try {
    const response = await apiClient.post<ApiResponse<SubscriptionUpdateResponse>>('/api/user/subscriptions/downgrade', {
      accountId,
      planId
    });
    return response.data;
  } catch (error) {
    console.error('Error downgrading subscription:', error);
    throw error;
  }
};