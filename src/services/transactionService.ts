import {
  fetchOverviewTransactionsApi,
  uploadPreviewTransactionsApi,
  fetchPreviewTransactionsApi,
  confirmTransactionsApi,
} from '../api/transactionApi';
import { PreviewTransaction } from 'types/PreviewTransaction';
import { OverviewTransaction } from 'types/OverviewTransaction';
import { Transaction } from '../types/Transaction';
import axios from 'axios';

export const fetchOverviewTransactions = async (accountId: string): Promise<OverviewTransaction[]> => {
  try {
    const response = await fetchOverviewTransactionsApi(accountId);
    return response.data;
  } catch (error) {
    console.error('Error fetching overview transactions:', error);
    throw error;
  }
};

export const uploadPreviewTransactions = async (
  accountId: string,
  transactions: Transaction[]
): Promise<Transaction[]> => {
  try {
    const response = await uploadPreviewTransactionsApi(accountId, transactions);
    return response.data;
  } catch (error) {
    console.error('Error uploading transactions:', error);
    throw error;
  }
};

export const fetchPreviewTransactions = async (
  accountId: string
): Promise<Transaction[]> => {
  try {
    const response = await fetchPreviewTransactionsApi(accountId);
    return response.data;
  } catch (error) {
    console.error('Error fetching preview transactions:', error);
    throw error;
  }
};

export const confirmTransactions = async (
  accountId: string,
  previewTransactions: PreviewTransaction[]
): Promise<void> => {
  try {
    await confirmTransactionsApi(accountId, previewTransactions);
    console.log('Transactions confirmed successfully.');
  } catch (error) {
    console.error('Error confirming transactions:', error);
    throw error;
  }
};