import React from 'react';
import { TimeRangeDisplayProps } from '../../types/TimeRange';
import { formatDateForDisplay } from '../../utils/timeRangePresets';
import './TimeRangeDisplay.css';

const TimeRangeDisplay: React.FC<TimeRangeDisplayProps> = ({
  timeRange,
  loading = false,
  className = ''
}) => {
  const formatRange = () => {
    const startFormatted = formatDateForDisplay(timeRange.startDate);
    const endFormatted = formatDateForDisplay(timeRange.endDate);
    
    if (timeRange.preset) {
      return `${startFormatted} - ${endFormatted}`;
    }
    
    return `Custom: ${startFormatted} - ${endFormatted}`;
  };

  return (
    <div className={`time-range-display ${className}`}>
      <div className="current-range">
        <span className="range-label">Current Range:</span>
        <span className="range-value">
          {loading ? 'Loading...' : formatRange()}
        </span>
      </div>
      {timeRange.preset && (
        <div className="preset-indicator">
          <span className="preset-badge">{timeRange.preset}</span>
        </div>
      )}
    </div>
  );
};

export default TimeRangeDisplay; 