import axios from 'axios';

// Fetch available currencies by account ID
export const fetchCurrenciesByAccountIdApi = async (accountId: string) => {
  return axios.get(`/api/currencies/fetch`, {
    params: { accountId },
  });
};

// Update the base currency for the account
export const updateBaseCurrencyApi = async (accountId: string, baseCurrency: string) => {
  const payload = {
    accountId,
    baseCurrency,
  };

  return axios.post(`/api/currencies/set-base-currency`, payload);
};