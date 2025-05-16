import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useRefreshCycle } from './useRefreshCycle';
import { fetchMarketData } from '../services/marketDataService';
import { SubscriptionPlanType } from '../types/SubscriptionPlan';
import { MarketData, WatchlistItem } from '../types/MarketData';

interface UseMarketDataProps {
  accountId: string | null;
  items: WatchlistItem[];
  subscriptionPlan: SubscriptionPlanType;
}

export const useMarketData = ({ accountId, items, subscriptionPlan }: UseMarketDataProps) => {
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const hasInitialFetch = useRef(false);

  // Memoize confirmed items
  const confirmedItems = useMemo(() => 
    items.filter(item => item.confirmed),
    [items]
  );

  const fetchData = useCallback(async () => {
    if (!accountId || confirmedItems.length === 0) {
      console.log('Skipping fetch - no valid items:', { 
        hasAccountId: !!accountId, 
        itemsCount: confirmedItems.length 
      });
      return;
    }

    try {
      console.log('Fetching market data for:', confirmedItems);
      setLoading(true);
      const data = await fetchMarketData(accountId, confirmedItems);
      setMarketData(data);
      setLastUpdated(new Date());
      hasInitialFetch.current = true;
    } catch (err) {
      setError('Failed to fetch market data');
      console.error('Error fetching market data:', err);
    } finally {
      setLoading(false);
    }
  }, [accountId, confirmedItems]);

  // Initial fetch
  useEffect(() => {
    if (!hasInitialFetch.current && accountId && confirmedItems.length > 0) {
      console.log('Performing initial fetch');
      fetchData();
    }
  }, [accountId, confirmedItems, fetchData]);

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