import { ChartData } from './ChartData';

export interface CombinedChartData {
  date: string; // The date of the data point
  assets: ChartData[];
}