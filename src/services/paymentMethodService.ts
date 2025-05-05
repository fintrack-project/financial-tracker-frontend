import axios from 'axios';
import {
  fetchPaymentMethodsApi,
  getDefaultPaymentMethodApi,
  attachPaymentMethodApi,
  setDefaultPaymentMethodApi,
  deletePaymentMethodApi,
  createPaymentIntentApi,
  confirmPaymentApi,
} from '../api/paymentMethodApi';
import { PaymentMethod } from '../types/PaymentMethod';

export const fetchPaymentMethods = async (accountId: string): Promise<PaymentMethod[]> => {
  try {
    const response = await fetchPaymentMethodsApi(accountId);
    return response.data;
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    throw new Error('Failed to fetch payment methods');
  }
};

export const getDefaultPaymentMethod = async (accountId: string): Promise<PaymentMethod | null> => {
  try {
    const response = await getDefaultPaymentMethodApi(accountId);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    console.error('Error fetching default payment method:', error);
    throw new Error('Failed to fetch default payment method');
  }
};

export const attachPaymentMethod = async (accountId: string, paymentMethodId: string): Promise<PaymentMethod> => {
  try {
    const response = await attachPaymentMethodApi(accountId, paymentMethodId);
    return response.data;
  } catch (error) {
    console.error('Error attaching payment method:', error);
    throw new Error('Failed to attach payment method');
  }
};

export const setDefaultPaymentMethod = async (accountId: string, paymentMethodId: string): Promise<void> => {
  try {
    await setDefaultPaymentMethodApi(accountId, paymentMethodId);
  } catch (error) {
    console.error('Error setting default payment method:', error);
    throw new Error('Failed to set default payment method');
  }
};

export const deletePaymentMethod = async (accountId: string, paymentMethodId: string): Promise<void> => {
  try {
    await deletePaymentMethodApi(accountId, paymentMethodId);
  } catch (error) {
    console.error('Error deleting payment method:', error);
    throw new Error('Failed to delete payment method');
  }
};

export const createPaymentIntent = async (accountId: string, amount: number, currency: string): Promise<any> => {
  try {
    const response = await createPaymentIntentApi(accountId, amount, currency);
    return response.data;
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw new Error('Failed to create payment intent');
  }
};

export const confirmPayment = async (accountId: string, paymentIntentId: string, paymentMethodId: string): Promise<any> => {
  try {
    const response = await confirmPaymentApi(accountId, paymentIntentId, paymentMethodId);
    return response.data;
  } catch (error) {
    console.error('Error confirming payment:', error);
    throw new Error('Failed to confirm payment');
  }
}; 