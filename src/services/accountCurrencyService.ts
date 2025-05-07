import {
  fetchCurrenciesByAccountIdApi,
  updateBaseCurrencyApi,
} from '../api/accountCurrencyApi';

export interface AccountCurrency {
  name: string;
  currency: string;
  default: boolean;
}

// Fetch available currencies by account ID
export const fetchCurrencies = async (accountId: string): Promise<AccountCurrency[]> => {
  try {
    const response = await fetchCurrenciesByAccountIdApi(accountId);
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to fetch currencies');
    }
    return response.data;
  } catch (error) {
    console.error('Error fetching currencies:', error);
    throw error;
  }
};

// Update the base currency for the account using POST
export const updateBaseCurrency = async (accountId: string, baseCurrency: string): Promise<void> => {
  try {
    const response = await updateBaseCurrencyApi(accountId, baseCurrency);
    if (!response.success) {
      throw new Error(response.message || 'Failed to update base currency');
    }
  } catch (error) {
    console.error('Error updating base currency:', error);
    throw error;
  }
};