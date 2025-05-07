import { apiClient } from '../utils/apiClient';
import { PaymentMethod, StripePaymentMethod } from '../types/PaymentMethods';

interface ErrorResponse {
  type: 'payment_error' | 'internal_error';
  message: string;
  code: string | null;
}

export class PaymentError extends Error {
  type: string;
  code: string | null;

  constructor(type: string, message: string, code: string | null) {
    super(message);
    this.type = type;
    this.code = code;
    this.name = 'PaymentError';
  }
}

const handleApiError = (error: unknown): never => {
  if (error instanceof Error) {
    const errorData = error as Error & { response?: { data: ErrorResponse } };
    if (errorData.response?.data) {
      const { type, message, code } = errorData.response.data;
      throw new PaymentError(type, message, code);
    }
  }
  throw new PaymentError('internal_error', 'An unexpected error occurred', null);
};

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Fetch all payment methods for an account
export const fetchPaymentMethodsApi = async (accountId: string): Promise<PaymentMethod[]> => {
  try {
    const response = await apiClient.post<ApiResponse<PaymentMethod[]>>('/api/user/payments/methods', { accountId });
    return response.data.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Get default payment method for an account
export const getDefaultPaymentMethodApi = async (accountId: string): Promise<PaymentMethod | null> => {
  try {
    const response = await apiClient.post<ApiResponse<PaymentMethod | null>>('/api/user/payments/default-method', { accountId });
    return response.data.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Attach a new payment method
export const attachPaymentMethodApi = async (accountId: string, paymentMethodId: string): Promise<PaymentMethod> => {
  try {
    const response = await apiClient.post<ApiResponse<PaymentMethod>>('/api/user/payments/attach-method', {
      accountId,
      paymentMethodId
    });
    return response.data.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Set a payment method as default
export const setDefaultPaymentMethodApi = async (accountId: string, paymentMethodId: string): Promise<void> => {
  try {
    await apiClient.post<ApiResponse<void>>('/api/user/payments/set-default', { accountId, paymentMethodId });
  } catch (error) {
    return handleApiError(error);
  }
};

// Delete a payment method
export const deletePaymentMethodApi = async (accountId: string, paymentMethodId: string): Promise<void> => {
  try {
    await apiClient.post<ApiResponse<void>>('/api/user/payments/delete-method', { accountId, paymentMethodId });
  } catch (error) {
    return handleApiError(error);
  }
};

// Create a payment intent
export const createPaymentIntentApi = async (accountId: string, amount: number, currency: string) => {
  try {
    const response = await apiClient.post<ApiResponse<any>>('/api/user/payments/create-intent', {
      accountId,
      amount,
      currency
    });
    return response.data.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Confirm a payment
export const confirmPaymentApi = async (accountId: string, paymentIntentId: string, paymentMethodId: string) => {
  try {
    const response = await apiClient.post<ApiResponse<any>>('/api/user/payments/confirm', {
      accountId,
      paymentIntentId,
      paymentMethodId
    });
    return response.data.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Verify a payment method exists
export const verifyPaymentMethodApi = async (paymentMethodId: string): Promise<StripePaymentMethod> => {
  try {
    const response = await apiClient.post<ApiResponse<StripePaymentMethod>>('/api/user/payments/verify-method', {
      paymentMethodId
    });
    return response.data.data;
  } catch (error) {
    return handleApiError(error);
  }
};