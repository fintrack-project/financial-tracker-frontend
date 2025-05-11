import { useState, useEffect, useCallback } from 'react';

export type SubscriptionPlan = 'FREE' | 'BASIC' | 'PREMIUM';

interface UseRefreshCycleProps {
  refreshInterval?: number;
  subscriptionPlan?: SubscriptionPlan;
  onRefresh: () => Promise<void>;
}

interface UseRefreshCycleReturn {
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refresh: () => Promise<void>;
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

  return marketClose.getTime() - now.getTime();
};

// Get refresh interval based on subscription plan
const getRefreshInterval = (plan: SubscriptionPlan): number => {
  switch (plan) {
    case 'FREE':
      return getMillisecondsUntilMarketClose(); // Update at market close
    case 'BASIC':
      return 6 * 60 * 60 * 1000; // 6 hours (4 times a day)
    case 'PREMIUM':
      return 60 * 1000; // 1 minute (near real-time)
    default:
      return getMillisecondsUntilMarketClose();
  }
};

export const useRefreshCycle = ({
  refreshInterval,
  subscriptionPlan = 'FREE',
  onRefresh
}: UseRefreshCycleProps): UseRefreshCycleReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      await onRefresh();
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh data');
      console.error('Refresh error:', err);
    } finally {
      setLoading(false);
    }
  }, [onRefresh]);

  useEffect(() => {
    // Initial refresh
    refresh();

    // Set up interval based on subscription plan
    const interval = setInterval(refresh, refreshInterval || getRefreshInterval(subscriptionPlan));

    // Clean up interval on unmount
    return () => clearInterval(interval);
  }, [refresh, refreshInterval, subscriptionPlan]);

  return { loading, error, lastUpdated, refresh };
}; 