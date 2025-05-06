import axios from 'axios';
import { SubscriptionDetails } from '../types/SubscriptionPlan';

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
  if (axios.isAxiosError(error)) {
    if (error.response?.data) {
      const errorData = error.response.data;
      throw new SubscriptionError(
        errorData.type || 'subscription_error', 
        errorData.message || 'Subscription operation failed',
        errorData.code || null
      );
    }
    
    throw new SubscriptionError(
      'subscription_error',
      error.response?.statusText || 'Subscription operation failed',
      String(error.response?.status) || null
    );
  }
  
  if (error instanceof Error) {
    throw new SubscriptionError('internal_error', error.message, null);
  }
  
  throw new SubscriptionError('internal_error', 'An unexpected error occurred', null);
};

/**
 * Fetch subscription details including plan information for a user
 */
export const fetchSubscriptionDetailsApi = async (accountId: string): Promise<SubscriptionDetails> => {
  try {
    console.log('Making API call to fetch subscription details with accountId:', accountId);
    const response = await axios.post('/api/user/subscriptions/details', { accountId });
    console.log('Subscription details API response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error in fetchSubscriptionDetailsApi:', error);
    return handleApiError(error);
  }
}; 