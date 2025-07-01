import { useState, useEffect } from 'react';
import { fetchCurrencies, updateBaseCurrency, AccountCurrency } from '../../features/profile/services/accountCurrencyService';

interface UseCurrencyManagementProps {
  accountId: string | null;
}

interface UseCurrencyManagementReturn {
  currencies: AccountCurrency[];
  baseCurrency: string;
  error: string | null;
  successMessage: string | null;
  handleBaseCurrencyChange: (event: React.ChangeEvent<HTMLSelectElement>) => Promise<void>;
}

export const useCurrencyManagement = ({ accountId }: UseCurrencyManagementProps): UseCurrencyManagementReturn => {
  const [currencies, setCurrencies] = useState<AccountCurrency[]>([]);
  const [baseCurrency, setBaseCurrency] = useState<string>('USD');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchUpdateCurrencies = async () => {
      if (!accountId) {
        setError('Account ID is required to fetch currencies.');
        return;
      }

      try {
        const fetchedCurrencies = await fetchCurrencies(accountId);
        setCurrencies(fetchedCurrencies);

        const defaultCurrency = fetchedCurrencies.find((currency: AccountCurrency) => currency.default);
        if (defaultCurrency) {
          setBaseCurrency(defaultCurrency.currency);
        }
      } catch (err) {
        setError('Failed to fetch currencies. Please try again later.');
      }
    };

    fetchUpdateCurrencies();
  }, [accountId]);

  const handleBaseCurrencyChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCurrency = event.target.value;
    setBaseCurrency(selectedCurrency);

    if (!accountId) {
      setError('Account ID is required to update the base currency.');
      return;
    }

    try {
      await updateBaseCurrency(accountId, selectedCurrency);
      setSuccessMessage(`Base currency updated to ${selectedCurrency}.`);
      setError(null);
    } catch (err) {
      setError('Failed to update base currency. Please try again later.');
      setSuccessMessage(null);
    }
  };

  return {
    currencies,
    baseCurrency,
    error,
    successMessage,
    handleBaseCurrencyChange
  };
}; 