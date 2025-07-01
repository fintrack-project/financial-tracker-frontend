import { useEffect, useState } from 'react';
import { fetchCurrencies, AccountCurrency } from '../../services/accountCurrencyService'
import { fetchMarketData } from '../../services/marketDataService';

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
        console.log('Fetching currencies for accountId:', accountId);
        const fetchedCurrencies = await fetchCurrencies(accountId);
        console.log('Fetched currencies:', fetchedCurrencies);

        const defaultCurrency = fetchedCurrencies.find((currency: AccountCurrency) => currency.default);
        console.log('Default currency found:', defaultCurrency);
        
        if (!defaultCurrency) {
          console.error('No default base currency found.');
          setError('No default base currency found.');
          setBaseCurrency('USD');
          setUsdToBaseCurrencyRate(1);
          return;
        }

        setBaseCurrency(defaultCurrency.currency);
        console.log('Set base currency to:', defaultCurrency.currency);

        if (defaultCurrency.currency === 'USD') {
          setUsdToBaseCurrencyRate(1); // USD to USD rate is always 1
        } else {
          console.log('Fetching market data for currency pair:', `USD/${defaultCurrency.currency}`);
          const marketData = await fetchMarketData(accountId, [
            {
              symbol: `USD/${defaultCurrency.currency}`,
              assetType: 'FOREX',
            },
          ]);
          console.log('Market data response:', marketData);

          if (marketData.length > 0) {
            setUsdToBaseCurrencyRate(marketData[0].price);
          }
        }

        setError(null);
      } catch (err) {
        console.error('Error fetching base currency:', err);
        setError('Failed to fetch the base currency.');
        // Set USD as fallback
        setBaseCurrency('USD');
        setUsdToBaseCurrencyRate(1);
      } finally {
        setLoading(false);
      }
    };

    fetchBaseCurrency();
  }, [accountId]);

  return { baseCurrency, usdToBaseCurrencyRate, loading, error };
};