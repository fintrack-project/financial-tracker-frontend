import axios from 'axios';

export interface PortfolioData {
  assetName: string;                  // Name of the asset (e.g., "Apple")
  quantity: number;                   // Quantity of the asset (e.g., 10)
  symbol: string;                     // Symbol of the asset (e.g., "AAPL")
  assetType: string;                  // Type of the asset (e.g., "STOCK", "FOREX")
  priceInBaseCurrency: number;        // Price of the asset in the base currency (e.g., 150.00)
  totalValueInBaseCurrency: number;   // Total value of the asset in the base currency (e.g., 1500.00)
}

export const fetchPortfolioData = async (accountId: string, baseCurrency: string): Promise<PortfolioData[]> => {
  try {
    const response = await axios.post('/api/portfolio/portfolio-data', {
      accountId,
      baseCurrency,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching portfolio data:', error);
    throw new Error('Failed to fetch portfolio data');
  }
};