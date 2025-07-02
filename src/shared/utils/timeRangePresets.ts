import { TimeRangePreset, TimeRangePresetOption, TimeRange } from '../types/TimeRange';

export const getTimeRangePresets = (): TimeRangePresetOption[] => [
  {
    label: '7 Days',
    value: '7D',
    getDateRange: () => {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - 7);
      return { startDate, endDate };
    }
  },
  {
    label: '30 Days',
    value: '30D',
    getDateRange: () => {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - 30);
      return { startDate, endDate };
    }
  },
  {
    label: '3 Months',
    value: '3M',
    getDateRange: () => {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setMonth(endDate.getMonth() - 3);
      return { startDate, endDate };
    }
  },
  {
    label: '6 Months',
    value: '6M',
    getDateRange: () => {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setMonth(endDate.getMonth() - 6);
      return { startDate, endDate };
    }
  },
  {
    label: '1 Year',
    value: '1Y',
    getDateRange: () => {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setFullYear(endDate.getFullYear() - 1);
      return { startDate, endDate };
    }
  },
  {
    label: 'Year to Date',
    value: 'YTD',
    getDateRange: () => {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setMonth(0, 1); // January 1st of current year
      return { startDate, endDate };
    }
  },
  {
    label: 'All Time',
    value: 'ALL',
    getDateRange: () => {
      const endDate = new Date();
      const startDate = new Date(2020, 0, 1); // Default to 2020, can be adjusted
      return { startDate, endDate };
    }
  }
];

export const getDefaultTimeRange = (): TimeRange => {
  const preset = getTimeRangePresets().find(p => p.value === '3M');
  const { startDate, endDate } = preset!.getDateRange();
  return {
    startDate,
    endDate,
    preset: '3M'
  };
};

export const formatDateForDisplay = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatDateForAPI = (date: Date): string => {
  return date.toISOString().split('T')[0]; // YYYY-MM-DD format
};

export const createTimeRangeFromPreset = (preset: TimeRangePreset): TimeRange => {
  const presetOption = getTimeRangePresets().find(p => p.value === preset);
  if (!presetOption) {
    throw new Error(`Invalid preset: ${preset}`);
  }
  
  const { startDate, endDate } = presetOption.getDateRange();
  return {
    startDate,
    endDate,
    preset
  };
};

export const createCustomTimeRange = (startDate: Date, endDate: Date): TimeRange => {
  return {
    startDate,
    endDate
    // No preset for custom ranges
  };
}; 