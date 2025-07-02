import { useState, useEffect } from 'react';
import { fetchHoldingsApi } from '../api/holdingsApi';
import { fetchPortfolioDataApi } from '../api/portfolioApi';
import { useBaseCurrency } from '../../../shared/hooks/useBaseCurrency';
import { Holding } from '../types/Holding';
import { PortfolioData } from '../types/PortfolioData';

export const useHoldingsData = (accountId: string | null) => {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [portfolioData, setPortfolioData] = useState<PortfolioData[]>([]);
  const [loading, setLoading] = useState(true);
  const { baseCurrency } = useBaseCurrency(accountId);

  useEffect(() => {
    const loadHoldingsAndMarketData = async () => {
      if (!accountId || !baseCurrency) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Fetch holdings data
        const holdingsResponse = await fetchHoldingsApi(accountId);
        if (holdingsResponse.success && holdingsResponse.data) {
          setHoldings(holdingsResponse.data);
        }

        // Fetch portfolio data
        const portfolioResponse = await fetchPortfolioDataApi(accountId, baseCurrency);
        if (portfolioResponse.success && portfolioResponse.data) {
          setPortfolioData(portfolioResponse.data);
        }
      } catch (error) {
        console.error('Error loading holdings data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadHoldingsAndMarketData();
  }, [accountId, baseCurrency]);

  return { holdings, portfolioData, loading };
}; 