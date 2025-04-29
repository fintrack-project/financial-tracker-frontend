import { useEffect, useState } from 'react';
import { fetchHoldings } from '../services/holdingsService';
import { fetchMarketData, MarketDataProps } from '../services/marketDataService';
import { fetchCurrenciesByAccountId } from '../services/accountCurrencyService';
import { Holding } from '../types/Holding';

export const useHoldingsData = (accountId: string | null) => {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [marketData, setMarketData] = useState<MarketDataProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

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
        const fetchedCurrencies = await fetchCurrenciesByAccountId(accountId);
        console.log('Fetched currencies:', fetchedCurrencies);

        // Find and get the base (default) currency
        const baseCurrency = fetchedCurrencies.find((currency) => currency.default);
        if (!baseCurrency) {
          console.error('No default base currency found.');
          return;
        }
        console.log('Base currency:', baseCurrency.currency);

        // Step 3: Extract symbols and assetType
        const entities = fetchedHoldings
          .filter((holding) => holding.assetType !== undefined) // Filter out undefined assetTypes
          .filter((holding) => {
            // Exclude holdings where baseCurrency matches holding.symbol for FOREX
            if (
              (holding.assetType === 'FOREX') &&
              baseCurrency.currency === holding.symbol
            ) {
              console.log(`Excluding holding: ${holding.symbol} (matches base currency)`);
              return false;
            }
            return true;
          })
          .map((holding) => {
            const symbol =
              holding.assetType === 'FOREX'
                ? `${holding.symbol}/${baseCurrency.currency}` // Use base currency for FOREX
                : holding.symbol; // Use holding symbol for other asset types
            return {
              symbol,
              assetType: holding.assetType as string, // Type assertion since undefined is filtered out
            };
          });

        console.log('Entities:', entities);

        // Step 4: Fetch the updated market data
        const marketDataResponse = await fetchMarketData(accountId, entities);
        console.log('Fetched Market data:', marketDataResponse);

        setMarketData(marketDataResponse);
      } catch (error) {
        console.error('Error loading holdings or market data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadHoldingsAndMarketData();
  }, [accountId]);

  return { holdings, marketData, loading };
};