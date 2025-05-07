import { apiClient } from '../utils/apiClient';
import { SubscriptionDetails } from '../types/SubscriptionPlan';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

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
 * Fetch subscription details including plan information for a user
 */
export const fetchSubscriptionDetailsApi = async (accountId: string): Promise<ApiResponse<SubscriptionDetails>> => {
  try {
    console.log('Making API call to fetch subscription details with accountId:', accountId);
    const response = await apiClient.post<ApiResponse<SubscriptionDetails>>('/api/user/subscriptions/details', { accountId });
    console.log('Subscription details API response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error in fetchSubscriptionDetailsApi:', error);
    return handleApiError(error);
  }
}; 