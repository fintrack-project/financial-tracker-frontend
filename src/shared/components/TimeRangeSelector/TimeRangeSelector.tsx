import React, { useState } from 'react';
import { TimeRangePickerProps } from '../../types/TimeRange';
import { getTimeRangePresets } from '../../utils/timeRangePresets';
import PresetRanges from './PresetRanges';
import CustomRangeInput from './CustomRangeInput';
import TimeRangeDisplay from './TimeRangeDisplay';
import './TimeRangeSelector.css';

const TimeRangeSelector: React.FC<TimeRangePickerProps> = ({
  timeRange,
  onTimeRangeChange,
  loading = false,
  className = '',
  disabled = false
}) => {
  const [showCustomInput, setShowCustomInput] = useState(false);
  const presets = getTimeRangePresets();

  const handlePresetClick = (preset: string) => {
    const presetOption = presets.find(p => p.value === preset);
    if (presetOption) {
      const { startDate, endDate } = presetOption.getDateRange();
      onTimeRangeChange({
        startDate,
        endDate,
        preset: preset as any
      });
      setShowCustomInput(false);
    }
  };

  const handleCustomRangeChange = (startDate: Date, endDate: Date) => {
    onTimeRangeChange({
      startDate,
      endDate
      // No preset for custom ranges
    });
  };

  const handleCustomToggle = () => {
    setShowCustomInput(!showCustomInput);
  };

  return (
    <div className={`time-range-selector ${className}`}>
      <div className="time-range-header">
        <h3 className="time-range-title">Time Range</h3>
        <TimeRangeDisplay 
          timeRange={timeRange}
          onTimeRangeChange={onTimeRangeChange}
          loading={loading}
        />
      </div>
      
      <div className="time-range-content">
        <PresetRanges
          presets={presets}
          currentPreset={timeRange.preset}
          onPresetClick={handlePresetClick}
          onCustomToggle={handleCustomToggle}
          showCustomInput={showCustomInput}
          disabled={disabled || loading}
        />
        
        {showCustomInput && (
          <CustomRangeInput
            startDate={timeRange.startDate}
            endDate={timeRange.endDate}
            onRangeChange={handleCustomRangeChange}
            disabled={disabled || loading}
          />
        )}
      </div>
      
      {loading && (
        <div className="time-range-loading">
          <div className="loading-spinner"></div>
          <span>Loading data...</span>
        </div>
      )}
    </div>
  );
};

export default TimeRangeSelector; 