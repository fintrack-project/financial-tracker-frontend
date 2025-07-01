import { apiClient } from '../../../shared/utils/apiClient';
import { SubscriptionDetails } from '../types/SubscriptionPlan';
import { ApiResponse } from '../../../shared/types/ApiTypes';

export interface SubscriptionDetailsError {
  type: 'subscription_error' | 'internal_error';
  message: string;
  code: string | null;
}

export class SubscriptionError extends Error {
  type: string;
  code: string | null;

  constructor(type: string, message: string, code: string | null) {
    super(message);
    this.type = type;
    this.code = code;
    this.name = 'SubscriptionError';
  }
}

const handleApiError = (error: unknown): never => {
  if (error instanceof Error) {
    throw new SubscriptionError('internal_error', error.message, null);
  }
  throw new SubscriptionError('internal_error', 'An unexpected error occurred', null);
};

/**
 * Transform subscription data from camelCase to snake_case
 */
const transformSubscriptionData = (data: any): SubscriptionDetails => {
  if (!data) return data;

  return {
    ...data,
    plan: data.plan ? {
      ...data.plan,
      plan_group_id: data.plan.planGroupId || data.plan.plan_group_id, // Handle both cases
      id: data.plan.id,
      name: data.plan.name,
      amount: data.plan.amount,
      currency: data.plan.currency,
      interval: data.plan.interval,
      description: data.plan.description,
      features: data.plan.features
    } : null
  };
};

/**
 * Fetch subscription details including plan information for a user
 */
export const fetchSubscriptionDetailsApi = async (accountId: string): Promise<ApiResponse<SubscriptionDetails>> => {
  try {
    console.log('Making API call to fetch subscription details with accountId:', accountId);
    const response = await apiClient.post<ApiResponse<SubscriptionDetails>>('/api/user/subscriptions/details', { accountId });
    console.log('Subscription details API response:', response.data);
    
    // Transform the data before returning
    return {
      ...response.data,
      data: response.data.data ? transformSubscriptionData(response.data.data) : undefined
    };
  } catch (error) {
    console.error('Error in fetchSubscriptionDetailsApi:', error);
    return handleApiError(error);
  }
}; 