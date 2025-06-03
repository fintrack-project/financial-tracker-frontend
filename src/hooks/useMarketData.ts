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
  const confirmedItems = useMemo(() => {
    const filtered = items.filter(item => item.confirmed);
    console.log('🔍 Confirmed items after filtering:', filtered);
    return filtered;
  }, [items]);

  const fetchData = useCallback(async () => {
    if (!accountId || confirmedItems.length === 0) {
      console.log('⏭️ Skipping fetch - no valid items:', { 
        hasAccountId: !!accountId, 
        itemsCount: confirmedItems.length 
      });
      return;
    }

    try {
      console.log('🔄 Starting market data fetch for items:', confirmedItems);
      setLoading(true);
      const data = await fetchMarketData(accountId, confirmedItems);
      console.log('✅ Market data fetch successful:', {
        itemsCount: data.length,
        items: data.map(item => ({
          symbol: item.symbol,
          assetType: item.assetType,
          price: item.price,
          change: item.change
        }))
      });
      setMarketData(data);
      setLastUpdated(new Date());
      hasInitialFetch.current = true;
    } catch (err) {
      console.error('❌ Error fetching market data:', err);
      setError('Failed to fetch market data');
    } finally {
      setLoading(false);
    }
  }, [accountId, confirmedItems]);

  // Initial fetch
  useEffect(() => {
    if (!hasInitialFetch.current && accountId && confirmedItems.length > 0) {
      console.log('🚀 Performing initial fetch with:', {
        accountId,
        itemsCount: confirmedItems.length,
        items: confirmedItems
      });
      fetchData();
    }
  }, [accountId, confirmedItems, fetchData]);

  // Refresh cycle
  const { lastUpdated: cycleLastUpdated } = useRefreshCycle({
    subscriptionPlan,
    onRefresh: fetchData
  });

  // Log state changes
  useEffect(() => {
    console.log('📊 Market data state updated:', {
      dataCount: marketData.length,
      loading,
      error,
      lastUpdated: lastUpdated?.toISOString()
    });
  }, [marketData, loading, error, lastUpdated]);

  return {
    marketData,
    loading,
    error,
    lastUpdated: cycleLastUpdated || lastUpdated
  };
}; 