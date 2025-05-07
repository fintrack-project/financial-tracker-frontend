import { useEffect, useState } from 'react';
import { fetchCurrencies, AccountCurrency } from '../services/accountCurrencyService'
import { fetchMarketData } from '../services/marketDataService';

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
        const fetchedCurrencies = await fetchCurrencies(accountId);

        const defaultCurrency = fetchedCurrencies.find((currency: AccountCurrency) => currency.default);
        if (!defaultCurrency) {
          console.error('No default base currency found.');
          setError('No default base currency found.');
          setBaseCurrency('USD');
          return;
        }

        setBaseCurrency(defaultCurrency.symbol);

        if (defaultCurrency.symbol === 'USD') {
          setUsdToBaseCurrencyRate(1); // USD to USD rate is always 1
        } else {
          const marketData = await fetchMarketData(accountId, [
            {
              symbol: `USD/${defaultCurrency.symbol}`,
              assetType: 'FOREX', // Assuming the asset type is FOREX
            },
          ]);
          console.log(`Market data for USD/${defaultCurrency.symbol}:`, marketData);

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