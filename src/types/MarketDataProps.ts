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