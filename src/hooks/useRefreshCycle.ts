import { useState, useEffect, useCallback } from 'react';
import { SubscriptionPlanType } from '../types/SubscriptionPlan';

interface UseRefreshCycleProps {
  subscriptionPlan: SubscriptionPlanType;
  onRefresh: () => Promise<void>;
}

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

// Calculate milliseconds until next refresh for Basic plan (4 times per day)
const getMillisecondsUntilNextBasicRefresh = (): number => {
  const now = new Date();
  const marketClose = new Date(now);
  marketClose.setHours(US_MARKET_CLOSE_HOUR, US_MARKET_CLOSE_MINUTE, 0, 0);

  // If market is already closed today, schedule for tomorrow
  if (now > marketClose) {
    marketClose.setDate(marketClose.getDate() + 1);
  }

  // Calculate time between refreshes (6 hours)
  const msBetweenRefreshes = 6 * 60 * 60 * 1000;
  
  // Calculate time since market open (9:30 AM ET)
  const marketOpen = new Date(marketClose);
  marketOpen.setHours(9, 30, 0, 0);
  const msSinceMarketOpen = now.getTime() - marketOpen.getTime();
  
  // Calculate next refresh time
  const nextRefresh = new Date(marketOpen.getTime() + Math.ceil(msSinceMarketOpen / msBetweenRefreshes) * msBetweenRefreshes);
  
  // If next refresh is after market close, schedule for next day
  if (nextRefresh > marketClose) {
    nextRefresh.setDate(nextRefresh.getDate() + 1);
    nextRefresh.setHours(9, 30, 0, 0);
  }

  const msUntilNextRefresh = nextRefresh.getTime() - now.getTime();
  console.log('[useRefreshCycle] Next Basic refresh time:', nextRefresh.toLocaleString());
  console.log('[useRefreshCycle] Milliseconds until next Basic refresh:', msUntilNextRefresh);
  return msUntilNextRefresh;
};

export const useRefreshCycle = ({ subscriptionPlan, onRefresh }: UseRefreshCycleProps) => {
  console.log('[useRefreshCycle] Hook initialized with subscription plan:', subscriptionPlan);
  
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [hasFetched, setHasFetched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getRefreshInterval = useCallback(() => {
    console.log('[useRefreshCycle] Getting refresh interval for plan:', subscriptionPlan);
    switch (subscriptionPlan) {
      case 'FREE':
        const msUntilClose = getMillisecondsUntilMarketClose();
        console.log('[useRefreshCycle] FREE plan - will update at market close');
        return msUntilClose;
      case 'BASIC':
        const msUntilNextBasic = getMillisecondsUntilNextBasicRefresh();
        console.log('[useRefreshCycle] BASIC plan - will update 4 times per day');
        return msUntilNextBasic;
      case 'PREMIUM':
        console.log('[useRefreshCycle] PREMIUM plan - will update every minute');
        return 60 * 1000; // 1 minute
      default:
        console.log('[useRefreshCycle] Unknown plan, defaulting to market close');
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
    console.log('[useRefreshCycle] Current subscription plan:', subscriptionPlan);
    
    const shouldRefreshNow = timeSinceLastUpdate >= refreshInterval;
    console.log('[useRefreshCycle] Should refresh now:', shouldRefreshNow);
    
    return shouldRefreshNow;
  }, [lastUpdated, getRefreshInterval, subscriptionPlan]);

  const refresh = useCallback(async () => {
    console.log('[useRefreshCycle] Starting refresh cycle for plan:', subscriptionPlan);
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
  }, [onRefresh, subscriptionPlan]);

  useEffect(() => {
    console.log('[useRefreshCycle] Effect triggered with plan:', subscriptionPlan);
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
      console.log('[useRefreshCycle] Interval check for plan:', subscriptionPlan);
      if (shouldRefresh()) {
        console.log('[useRefreshCycle] Interval refresh triggered');
        refresh();
      }
    }, getRefreshInterval());

    return () => {
      console.log('[useRefreshCycle] Cleaning up interval');
      clearInterval(interval);
    };
  }, [hasFetched, lastUpdated, refresh, shouldRefresh, getRefreshInterval, subscriptionPlan]);

  return { lastUpdated, hasFetched, loading, error };
}; 