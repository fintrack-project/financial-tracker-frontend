import { useState, useEffect } from 'react';
import { useRefreshCycle } from './useRefreshCycle';
import { fetchMarketData } from '../services/marketDataService';
import { SubscriptionPlanType } from '../types/SubscriptionPlan';
import { MarketData, WatchlistItem } from '../types/MarketData';

interface UseMarketDataProps {
  accountId: string | null;
  symbols: WatchlistItem[];
  subscriptionPlan: SubscriptionPlanType;
}

export const useMarketData = ({ accountId, symbols, subscriptionPlan }: UseMarketDataProps) => {
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = async () => {
    if (!accountId || symbols.length === 0) return;
    
    try {
      setLoading(true);
      const data = await fetchMarketData(accountId, symbols);
      setMarketData(data);
      setLastUpdated(new Date());
    } catch (err) {
      setError('Failed to fetch market data');
      console.error('Error fetching market data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [accountId, symbols]);

  // Refresh cycle
  const { lastUpdated: cycleLastUpdated } = useRefreshCycle({
    subscriptionPlan,
    onRefresh: fetchData
  });

  return {
    marketData,
    loading,
    error,
    lastUpdated: cycleLastUpdated || lastUpdated
  };
}; 