import { useEffect, useState } from 'react';
import { fetchHoldings } from '../services/holdingsService';
import { updateMarketData, fetchMarketData, MarketDataProps } from '../services/marketDataService';
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

        // Step 2: Extract asset names from holdings
        const assetNames = fetchedHoldings.map((holding) => holding.assetName);

        // Step 3: Send asset names to the backend to initiate market data updates
        await updateMarketData(assetNames);

        // Step 4: Fetch the updated market data
        const marketDataResponse = await fetchMarketData(assetNames);
        setMarketData(marketDataResponse);

        console.log('Market data fetched successfully:', marketDataResponse);
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