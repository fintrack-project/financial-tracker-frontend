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
  return msUntilNextRefresh;
};

export const useRefreshCycle = ({ subscriptionPlan, onRefresh }: UseRefreshCycleProps) => {
  
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [hasFetched, setHasFetched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getRefreshInterval = useCallback(() => {
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
      return true;
    }

    const now = new Date();
    const timeSinceLastUpdate = now.getTime() - lastUpdated.getTime();
    const refreshInterval = getRefreshInterval();
    
    console.log('[useRefreshCycle] Time since last update:', timeSinceLastUpdate / 1000, 'seconds');
    console.log('[useRefreshCycle] Refresh interval:', refreshInterval / 1000, 'seconds');
    
    const shouldRefreshNow = timeSinceLastUpdate >= refreshInterval;
    
    return shouldRefreshNow;
  }, [lastUpdated, getRefreshInterval, subscriptionPlan]);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      await onRefresh();
      setLastUpdated(new Date());
      setHasFetched(true);
    } catch (err) {
      console.error('[useRefreshCycle] Refresh error:', err);
      setError(err instanceof Error ? err.message : 'Failed to refresh data');
    } finally {
      setLoading(false);
    }
  }, [onRefresh, subscriptionPlan]);

  useEffect(() => {
    if (!hasFetched) {
      refresh();
      return;
    }

    if (shouldRefresh()) {
      refresh();
    }

    const interval = setInterval(() => {
      if (shouldRefresh()) {
        refresh();
      }
    }, getRefreshInterval());

    return () => {
      clearInterval(interval);
    };
  }, [hasFetched, lastUpdated, refresh, shouldRefresh, getRefreshInterval, subscriptionPlan]);

  return { lastUpdated, hasFetched, loading, error };
}; 