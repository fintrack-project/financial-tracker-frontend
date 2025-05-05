import axios from 'axios';
import { PaymentMethod } from '../types/PaymentMethod';

// Fetch all payment methods for an account
export const fetchPaymentMethodsApi = async (accountId: string): Promise<PaymentMethod[]> => {
  try {
    const response = await axios.post('/api/user/payments/methods', { accountId });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to fetch payment methods');
    }
    throw error;
  }
};

// Get default payment method for an account
export const getDefaultPaymentMethodApi = async (accountId: string): Promise<PaymentMethod | null> => {
  try {
    const response = await axios.post('/api/user/payments/default-method', { accountId });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to fetch default payment method');
    }
    throw error;
  }
};

// Attach a new payment method
export const attachPaymentMethodApi = async (accountId: string, paymentMethodId: string): Promise<PaymentMethod> => {
  try {
    const response = await axios.post('/api/user/payments/attach-method', { accountId, paymentMethodId });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to attach payment method');
    }
    throw error;
  }
};

// Set a payment method as default
export const setDefaultPaymentMethodApi = async (accountId: string, paymentMethodId: string): Promise<void> => {
  try {
    await axios.post('/api/user/payments/set-default', { accountId, paymentMethodId });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to set default payment method');
    }
    throw error;
  }
};

// Delete a payment method
export const deletePaymentMethodApi = async (accountId: string, paymentMethodId: string): Promise<void> => {
  try {
    await axios.post('/api/user/payments/delete-method', { accountId, paymentMethodId });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to delete payment method');
    }
    throw error;
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
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to create payment intent');
    }
    throw error;
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
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to confirm payment');
    }
    throw error;
  }
}; 