import { useEffect, useState } from 'react';
import { fetchHoldings } from '../services/holdingsService';
import { fetchMarketData, MarketDataProps } from '../services/marketDataService';
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

        // Step 2: Extract symbols and hardcode assetType to 'STOCK'
        const entities = fetchedHoldings.map((holding) => ({
          symbol: holding.symbol,
          assetType: 'STOCK', // TODO: Replace with actual assetType when available in Holding
        }));

        // Step 3: Fetch the updated market data
        const marketDataResponse = await fetchMarketData(accountId, entities);
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