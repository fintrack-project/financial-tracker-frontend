export interface TimeRange {
  startDate: Date;
  endDate: Date;
  preset?: TimeRangePreset;
}

export type TimeRangePreset = 
  | '7D' 
  | '30D' 
  | '3M' 
  | '6M' 
  | '1Y' 
  | 'YTD' 
  | 'ALL';

export interface TimeRangePresetOption {
  label: string;
  value: TimeRangePreset;
  getDateRange: () => { startDate: Date; endDate: Date };
}

export interface TimeRangeDisplayProps {
  timeRange: TimeRange;
  onTimeRangeChange: (timeRange: TimeRange) => void;
  loading?: boolean;
  className?: string;
}

export interface TimeRangePickerProps {
  timeRange: TimeRange;
  onTimeRangeChange: (timeRange: TimeRange) => void;
  loading?: boolean;
  className?: string;
  disabled?: boolean;
} 