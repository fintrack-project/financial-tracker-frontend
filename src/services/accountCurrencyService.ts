import axios from 'axios';

export interface AccountCurrency {
  currency: string;
  default: boolean;
}

// Fetch available currencies by account ID
export const fetchCurrenciesByAccountId = async (accountId: string): Promise<AccountCurrency[]> => {
  try {
    const response = await axios.get(`/api/currencies/fetch`, {
      params: { accountId },
    });
    return response.data; // Return the list of currencies with default information
  } catch (error) {
    console.error('Error fetching currencies:', error);
    throw error;
  }
};

// Update the base currency for the account using POST
export const updateBaseCurrency = async (accountId: string, baseCurrency: string) => {
  const payload = {
    accountId,
    baseCurrency,
  };

  try {
    const response = await axios.post(`/api/currencies/set-base-currency`, payload);
    return response.data; // Return the response from the backend
  } catch (error) {
    console.error('Error updating base currency:', error);
    throw error;
  }
};