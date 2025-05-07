import { useEffect, useState } from 'react';
import { fetchHoldings } from '../services/holdingsService';
import { fetchPortfolioData } from '../services/portfolioService';
import { fetchCurrencies, AccountCurrency } from '../services/accountCurrencyService';
import { PortfolioData } from 'types/PortfolioData';
import { Holding } from '../types/Holding';

export const useHoldingsData = (accountId: string | null) => {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [portfolioData, setPortfolioData] = useState<PortfolioData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accountId) {
      console.warn('Account ID is null, skipping fetch');
      setLoading(false);
      return;
    }

    const loadHoldingsAndMarketData = async () => {
      try {
        setLoading(true);

        // Step 1: Fetch holdings from the backend
        const fetchedHoldings = await fetchHoldings(accountId);
        setHoldings(fetchedHoldings);

        // Step 2: Fetch the base currency of the user
        const fetchedCurrencies = await fetchCurrencies(accountId);

        // Find and get the base (default) currency
        const baseCurrency = fetchedCurrencies.find((currency: AccountCurrency) => currency.default);
        if (!baseCurrency) {
          console.error('No default base currency found.');
          return;
        }

        // Step 3: Fetch portfolio data using the new service
        const portfolioDataResponse = await fetchPortfolioData(accountId, baseCurrency.symbol);
        console.log('Fetched portfolio data:', portfolioDataResponse);

        setPortfolioData(portfolioDataResponse);
        setError(null); // Clear any previous errors
      } catch (error) {
        console.error('Error loading holdings or market data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadHoldingsAndMarketData();
  }, [accountId]);

  return { holdings, portfolioData, loading };
};