import * as dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.ALPHA_VANTAGE_API_KEY; // Replace with your Alpha Vantage API key
const BASE_URL = 'https://www.alphavantage.co/query';

export const fetchMarketData = async (symbol: string): Promise<{ price: string; change: string }> => {
  try {
    const response = await fetch(`${BASE_URL}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`);
    if (!response.ok) {
      throw new Error('Failed to fetch market data');
    }
    const data = await response.json();
    const quote = data['Global Quote'];
    return {
      price: quote['05. price'],
      change: quote['10. change percent'],
    };
  } catch (error) {
    console.error('Error fetching market data:', error);
    throw error;
  }
};