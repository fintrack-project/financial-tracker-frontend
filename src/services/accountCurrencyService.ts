import {
  fetchCurrenciesByAccountIdApi,
  updateBaseCurrencyApi,
} from '../api/accountCurrencyApi';

export interface AccountCurrency {
  currency: string;
  default: boolean;
}

// Fetch available currencies by account ID
export const fetchCurrenciesByAccountId = async (accountId: string): Promise<AccountCurrency[]> => {
  try {
    const response = await fetchCurrenciesByAccountIdApi(accountId);
    return response.data; // Return the list of currencies with default information
  } catch (error) {
    console.error('Error fetching currencies:', error);
    throw error;
  }
};

// Update the base currency for the account using POST
export const updateBaseCurrency = async (accountId: string, baseCurrency: string) => {
  try {
    const response = await updateBaseCurrencyApi(accountId, baseCurrency);
    return response.data; // Return the response from the backend
  } catch (error) {
    console.error('Error updating base currency:', error);
    throw error;
  }
};