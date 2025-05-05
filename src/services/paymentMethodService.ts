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
    return await fetchPaymentMethodsApi(accountId);
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    throw error;
  }
};

export const getDefaultPaymentMethod = async (accountId: string): Promise<PaymentMethod | null> => {
  try {
    return await getDefaultPaymentMethodApi(accountId);
  } catch (error) {
    console.error('Error fetching default payment method:', error);
    throw error;
  }
};

export const attachPaymentMethod = async (accountId: string, paymentMethodId: string): Promise<PaymentMethod> => {
  try {
    return await attachPaymentMethodApi(accountId, paymentMethodId);
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
    throw error;
  }
};

export const deletePaymentMethod = async (accountId: string, paymentMethodId: string): Promise<void> => {
  try {
    await deletePaymentMethodApi(accountId, paymentMethodId);
  } catch (error) {
    console.error('Error deleting payment method:', error);
    throw error;
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