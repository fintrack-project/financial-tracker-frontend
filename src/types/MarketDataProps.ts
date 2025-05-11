export interface MarketDataProps {
  id: number;
  symbol: string;
  assetType: string;
  price: number;
  change: number;
  high: number;
  low: number;
  percentChange: number;
  updatedAt: number[];
  assetName: string;
  priceUnit: string;
}

// Define the structure of market index data received from API
export interface MarketIndexData {
  symbol: string;
  name: string;
  price: number | string;
  price_change: number | string;
  percent_change: number | string;
  price_high?: number | string;
  price_low?: number | string;
}

export interface WatchlistItem {
  symbol: string;
  assetType: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}