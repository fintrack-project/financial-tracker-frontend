import axios from 'axios';

// Fetch portfolio pie chart data
export const fetchPortfolioPieChartDataApi = async (
  accountId: string,
  category: string,
  baseCurrency: string
) => {
  return axios.post('/api/portfolio/piechart-data', {
    accountId,
    category,
    baseCurrency,
  });
};

// Fetch portfolio combined bar chart data
export const fetchPortfolioCombinedBarChartDataApi = async (
  accountId: string,
  category: string,
  baseCurrency: string
) => {
  return axios.post('/api/portfolio/barchart-data', {
    accountId,
    category,
    baseCurrency,
  });
};