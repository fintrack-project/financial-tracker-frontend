import { useEffect, useState } from 'react';
import { fetchCurrenciesByAccountId } from '../services/accountCurrencyService';
import { fetchMarketData } from '../services/marketDataService';

interface BaseCurrency {
  currency: string;
  default: boolean;
}

export const useBaseCurrency = (accountId: string | null) => {
  const [baseCurrency, setBaseCurrency] = useState<string | null>(null);
  const [usdToBaseCurrencyRate, setUsdToBaseCurrencyRate] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accountId) {
      setError('Account ID is required to fetch the base currency.');
      setLoading(false);
      return;
    }

    const fetchBaseCurrency = async () => {
      try {
        setLoading(true);
        const fetchedCurrencies = await fetchCurrenciesByAccountId(accountId);
        console.log('Fetched currencies:', fetchedCurrencies);

        const defaultCurrency = fetchedCurrencies.find((currency: BaseCurrency) => currency.default);
        if (!defaultCurrency) {
          console.error('No default base currency found.');
          setError('No default base currency found.');
          setBaseCurrency(null);
          return;
        }

        console.log('Default base currency:', defaultCurrency.currency);
        setBaseCurrency(defaultCurrency.currency);

        if (defaultCurrency.currency === 'USD') {
          setUsdToBaseCurrencyRate(1); // USD to USD rate is always 1
        } else {
          const marketData = await fetchMarketData(accountId, [
            {
              symbol: `USD/${defaultCurrency.currency}`,
              assetType: 'FOREX', // Assuming the asset type is FOREX
            },
          ]);
          console.log(`Market data for USD/${defaultCurrency.currency}:`, marketData);

          if (marketData.length > 0) {
            setUsdToBaseCurrencyRate(marketData[0].price); // Use the fetched price as the rate
          }
        }

        setError(null); // Clear any previous errors
      } catch (err) {
        console.error('Error fetching base currency:', err);
        setError('Failed to fetch the base currency.');
        setBaseCurrency(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBaseCurrency();
  }, [accountId]);

  return { baseCurrency, usdToBaseCurrencyRate, loading, error };
};