export interface ChartData {
  assetName: string;       // Name of the asset (e.g., "Apple")
  symbol: string;
  value: number;           // Value of the asset in the base currency
  percentage: number;      // Percentage of the total portfolio
  color: string;           // Color for the chart slice
  priority: number;
  totalValue: number;
  subcategory: string;     // Subcategory name (if applicable)
  subcategoryValue: number; // Value of the subcategory
  percentageOfSubcategory: number; // Percentage of the subcategory
}

export interface RawChartDataEntry {
  date: string;
  data: ChartData[];
}