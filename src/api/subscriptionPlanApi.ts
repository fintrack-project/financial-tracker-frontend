import { apiClient } from '../utils/apiClient';
import { ApiResponse } from '../types/ApiTypes';
import { SubscriptionPlanResponse, SubscriptionPlanType } from '../types/SubscriptionPlan';
import { SubscriptionPlan } from '../types/SubscriptionPlan';

export const getAllPlansApi = async (): Promise<ApiResponse<SubscriptionPlanResponse[]>> => {
  try {
    const response = await apiClient.get<ApiResponse<SubscriptionPlanResponse[]>>('/api/subscription-plans');
    return response.data;
  } catch (error) {
    console.error('Error fetching all plans:', error);
    throw error;
  }
};

export const getPlanByIdApi = async (planId: string): Promise<ApiResponse<SubscriptionPlanResponse>> => {
  try {
    const response = await apiClient.get<ApiResponse<SubscriptionPlanResponse>>(`/api/subscription-plans/${planId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching plan by ID:', error);
    throw error;
  }
};

export const getAllPlansBasicApi = async (): Promise<ApiResponse<SubscriptionPlan[]>> => {
  try {
    const response = await apiClient.get<ApiResponse<SubscriptionPlan[]>>('/api/subscription-plans/basic');
    return response.data;
  } catch (error) {
    console.error('Error fetching basic plans:', error);
    throw error;
  }
};

export const getPlanByNameApi = async (name: string): Promise<ApiResponse<SubscriptionPlanResponse>> => {
  try {
    const response = await apiClient.get<ApiResponse<SubscriptionPlanResponse>>(`/api/subscription-plans/by-name/${name}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching plan by name:', error);
    throw error;
  }
};

export const lookupPlanIdApi = async (planName: string): Promise<ApiResponse<{ planId: string; stripePriceId: string }>> => {
  try {
    const response = await apiClient.post<ApiResponse<{ planId: string; stripePriceId: string }>>('/api/subscription-plans/lookup', { planName });
    return response.data;
  } catch (error) {
    console.error('Error looking up plan ID:', error);
    throw error;
  }
}; 