import { useState, useEffect, useCallback } from 'react';

export type SubscriptionPlan = 'FREE' | 'BASIC' | 'PREMIUM';

// US Market closing time (4:00 PM ET)
const US_MARKET_CLOSE_HOUR = 16;
const US_MARKET_CLOSE_MINUTE = 0;

// Calculate milliseconds until next market close
const getMillisecondsUntilMarketClose = (): number => {
  const now = new Date();
  const marketClose = new Date(now);
  marketClose.setHours(US_MARKET_CLOSE_HOUR, US_MARKET_CLOSE_MINUTE, 0, 0);

  // If market is already closed today, schedule for tomorrow
  if (now > marketClose) {
    marketClose.setDate(marketClose.getDate() + 1);
  }

  const msUntilClose = marketClose.getTime() - now.getTime();
  console.log('[useRefreshCycle] Market close time:', marketClose.toLocaleString());
  console.log('[useRefreshCycle] Milliseconds until market close:', msUntilClose);
  return msUntilClose;
};

interface UseRefreshCycleProps {
  subscriptionPlan: SubscriptionPlan;
  onRefresh: () => Promise<void>;
}

export const useRefreshCycle = ({ subscriptionPlan, onRefresh }: UseRefreshCycleProps) => {
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [hasFetched, setHasFetched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getRefreshInterval = useCallback(() => {
    console.log('[useRefreshCycle] Current subscription plan:', subscriptionPlan);
    switch (subscriptionPlan) {
      case 'FREE':
        const msUntilClose = getMillisecondsUntilMarketClose();
        console.log('[useRefreshCycle] FREE plan - will update at market close');
        return msUntilClose;
      case 'BASIC':
        return 5 * 60 * 1000; // 5 minutes
      case 'PREMIUM':
        return 60 * 1000; // 1 minute
      default:
        return getMillisecondsUntilMarketClose();
    }
  }, [subscriptionPlan]);

  const shouldRefresh = useCallback(() => {
    if (!lastUpdated) {
      console.log('[useRefreshCycle] No last update time, should refresh');
      return true;
    }

    const now = new Date();
    const timeSinceLastUpdate = now.getTime() - lastUpdated.getTime();
    const refreshInterval = getRefreshInterval();
    
    console.log('[useRefreshCycle] Time since last update:', timeSinceLastUpdate / 1000, 'seconds');
    console.log('[useRefreshCycle] Refresh interval:', refreshInterval / 1000, 'seconds');
    
    const shouldRefreshNow = timeSinceLastUpdate >= refreshInterval;
    console.log('[useRefreshCycle] Should refresh now:', shouldRefreshNow);
    
    return shouldRefreshNow;
  }, [lastUpdated, getRefreshInterval]);

  const refresh = useCallback(async () => {
    console.log('[useRefreshCycle] Starting refresh cycle');
    try {
      setLoading(true);
      setError(null);
      await onRefresh();
      setLastUpdated(new Date());
      setHasFetched(true);
      console.log('[useRefreshCycle] Refresh cycle completed');
    } catch (err) {
      console.error('[useRefreshCycle] Refresh error:', err);
      setError(err instanceof Error ? err.message : 'Failed to refresh data');
    } finally {
      setLoading(false);
    }
  }, [onRefresh]);

  useEffect(() => {
    console.log('[useRefreshCycle] Effect triggered');
    console.log('[useRefreshCycle] Has fetched:', hasFetched);
    console.log('[useRefreshCycle] Last updated:', lastUpdated);

    if (!hasFetched) {
      console.log('[useRefreshCycle] Initial fetch');
      refresh();
      return;
    }

    if (shouldRefresh()) {
      console.log('[useRefreshCycle] Scheduled refresh triggered');
      refresh();
    }

    const interval = setInterval(() => {
      console.log('[useRefreshCycle] Interval check');
      if (shouldRefresh()) {
        console.log('[useRefreshCycle] Interval refresh triggered');
        refresh();
      }
    }, getRefreshInterval());

    return () => {
      console.log('[useRefreshCycle] Cleaning up interval');
      clearInterval(interval);
    };
  }, [hasFetched, lastUpdated, refresh, shouldRefresh, getRefreshInterval]);

  return { lastUpdated, hasFetched, loading, error };
}; 