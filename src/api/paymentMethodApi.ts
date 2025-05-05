import axios from 'axios';
import { PaymentMethod } from '../types/PaymentMethod';

// Fetch all payment methods for an account
export const fetchPaymentMethodsApi = async (accountId: string) => {
  return axios.post<PaymentMethod[]>('/api/user/payments/methods', { accountId });
};

// Get default payment method for an account
export const getDefaultPaymentMethodApi = async (accountId: string) => {
  return axios.post<PaymentMethod>('/api/user/payments/default-method', { accountId });
};

// Attach a new payment method
export const attachPaymentMethodApi = async (accountId: string, paymentMethodId: string) => {
  return axios.post<PaymentMethod>('/api/user/payments/attach-method', {
    accountId,
    paymentMethodId
  });
};

// Set a payment method as default
export const setDefaultPaymentMethodApi = async (accountId: string, paymentMethodId: string) => {
  return axios.post('/api/user/payments/set-default', {
    accountId,
    paymentMethodId
  });
};

// Delete a payment method
export const deletePaymentMethodApi = async (accountId: string, paymentMethodId: string) => {
  return axios.post('/api/user/payments/delete-method', {
    accountId,
    paymentMethodId
  });
};

// Create a payment intent
export const createPaymentIntentApi = async (accountId: string, amount: number, currency: string) => {
  return axios.post('/api/user/payments/create-intent', {
    accountId,
    amount,
    currency
  });
};

// Confirm a payment
export const confirmPaymentApi = async (accountId: string, paymentIntentId: string, paymentMethodId: string) => {
  return axios.post('/api/user/payments/confirm', {
    accountId,
    paymentIntentId,
    paymentMethodId
  });
}; 