// Alpha vantage api doc https://www.alphavantage.co/documentation/
const ALPHA_VANTAGE_API_KEY = process.env.REACT_APP_ALPHA_VANTAGE_API_KEY;
const ALPHA_VANTAGE_BASE_URL = 'https://www.alphavantage.co/query';

// Yahoo finance api doc https://rapidapi.com/apidojo/api/yahoo-finance1/playground
const RAPID_API_KEY = process.env.REACT_APP_RAPID_API_KEY;
const RAPID_BASE_URL = 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/v2/get-quotes';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const fetchAlphaVantageMarketData = async (symbols: string[]): Promise<{ [key: string]: { price: string; change: string } }> => {
  if (!ALPHA_VANTAGE_API_KEY) {
    throw new Error('API key is missing. Please set REACT_APP_ALPHA_VANTAGE_API_KEY in your .env file.');
  }

  const result: { [key: string]: { price: string; change: string } } = {};

  try {
    for (const symbol of symbols) {
      const response = await fetch(`${ALPHA_VANTAGE_BASE_URL}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch market data for symbol: ${symbol}`);
      }

      const data = await response.json();
      const quote = data['Global Quote'];

      if (!quote || Object.keys(quote).length === 0) {
        console.warn(`No data found for symbol: ${symbol}`);
        continue;
      }

      result[symbol] = {
        price: quote['05. price'] || 'N/A',
        change: quote['10. change percent'] || 'N/A',
      };

      // Add a delay to avoid hitting Alpha Vantage's rate limit (5 requests per minute)
      await new Promise((resolve) => setTimeout(resolve, 12000)); // 12-second delay
    }

    return result;
  } catch (error) {
    console.error('Error fetching market data from Alpha Vantage:', error);
    throw error;
  }
};

export const fetchRapidApiMarketData = async (symbols: string[]): Promise<{ [key: string]: { price: string; change: string } }> => {
  if (!RAPID_API_KEY) {
    throw new Error('API key is missing. Please set REACT_APP_RAPID_API_KEY in your .env file.');
  }

  try {
    // Add a delay to avoid hitting the rate limit
    await delay(1000); // 1-second delay

    const response = await fetch(`${RAPID_BASE_URL}?region=US&symbols=${symbols.join(',')}`, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': RAPID_API_KEY,
        'X-RapidAPI-Host': 'apidojo-yahoo-finance-v1.p.rapidapi.com',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch market data from Yahoo Finance');
    }

    const data = await response.json();
    const quotes = data.quoteResponse.result;

    if (!quotes || quotes.length === 0) {
      throw new Error('Invalid or empty data received from Yahoo Finance API');
    }

    // Map the response to a simpler format
    const result: { [key: string]: { price: string; change: string } } = {};
    quotes.forEach((quote: any) => {
      result[quote.symbol] = {
        price: quote.regularMarketPrice.toFixed(2),
        change: `${quote.regularMarketChangePercent.toFixed(2)}%`,
      };
    });

    return result;
  } catch (error) {
    console.error('Error fetching market data from Yahoo Finance:', error);
    throw error;
  }
};