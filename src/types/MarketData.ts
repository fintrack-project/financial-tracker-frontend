// Base market data interface that contains all possible fields
export interface MarketData {
  symbol: string;
  assetType: string;
  name?: string;
  price: number;
  change: number;
  percentChange: number;
  high: number;
  low: number;
  updatedAt: number[];
}

// Interface for watchlist items (minimal data needed for watchlist management)
export interface WatchlistItem {
  symbol: string;
  assetType: string;
}

// Interface for market index data (specific format for indices)
export interface MarketIndexData {
  symbol: string;
  name: string;
  price: number | string;
  priceChange: number | string;
  percentChange: number | string;
  priceHigh?: number | string;
  priceLow?: number | string;
}

// Interface for displaying market data in tables
export interface MarketDataDisplay {
  symbol: string;
  assetType: string;
  price: number;
  priceChange: number;
  percentChange: number;
  high: number;
  low: number;
  confirmed?: boolean;
} 