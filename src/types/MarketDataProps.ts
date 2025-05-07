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

export interface MarketIndexData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  lastUpdated: string;
}

export interface WatchlistItem {
  symbol: string;
  assetType: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}