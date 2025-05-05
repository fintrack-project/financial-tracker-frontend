import axios, { AxiosError } from 'axios';
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
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ErrorResponse>;
    if (axiosError.response?.data) {
      const errorData = axiosError.response.data;
      throw new PaymentError(errorData.type, errorData.message, errorData.code);
    }
  }
  throw new PaymentError('internal_error', 'An unexpected error occurred', null);
};

// Fetch all payment methods for an account
export const fetchPaymentMethodsApi = async (accountId: string): Promise<PaymentMethod[]> => {
  try {
    const response = await axios.post('/api/user/payments/methods', { accountId });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Get default payment method for an account
export const getDefaultPaymentMethodApi = async (accountId: string): Promise<PaymentMethod | null> => {
  try {
    const response = await axios.post('/api/user/payments/default-method', { accountId });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Attach a new payment method
export const attachPaymentMethodApi = async (accountId: string, paymentMethodId: string): Promise<PaymentMethod> => {
  try {
    const response = await axios.post('/api/user/payments/attach-method', {
      accountId,
      paymentMethodId
    });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Set a payment method as default
export const setDefaultPaymentMethodApi = async (accountId: string, paymentMethodId: string): Promise<void> => {
  try {
    await axios.post('/api/user/payments/set-default', { accountId, paymentMethodId });
  } catch (error) {
    return handleApiError(error);
  }
};

// Delete a payment method
export const deletePaymentMethodApi = async (accountId: string, paymentMethodId: string): Promise<void> => {
  try {
    await axios.post('/api/user/payments/delete-method', { accountId, paymentMethodId });
  } catch (error) {
    return handleApiError(error);
  }
};

// Create a payment intent
export const createPaymentIntentApi = async (accountId: string, amount: number, currency: string) => {
  try {
    const response = await axios.post('/api/user/payments/create-intent', {
      accountId,
      amount,
      currency
    });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Confirm a payment
export const confirmPaymentApi = async (accountId: string, paymentIntentId: string, paymentMethodId: string) => {
  try {
    const response = await axios.post('/api/user/payments/confirm', {
      accountId,
      paymentIntentId,
      paymentMethodId
    });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Verify a payment method exists
export const verifyPaymentMethodApi = async (paymentMethodId: string): Promise<StripePaymentMethod> => {
  try {
    const response = await axios.post('/api/user/payments/verify-method', {
      paymentMethodId
    });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};