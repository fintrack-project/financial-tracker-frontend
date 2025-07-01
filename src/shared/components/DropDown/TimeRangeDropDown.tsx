import React from 'react';
import './TimeRangeDropDown.css'; // Optional CSS for styling

interface TimeRangeDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

const TimeRangeDropdown: React.FC<TimeRangeDropdownProps> = ({ value, onChange }) => {
  const timeRanges = ['Monthly', 'Quarterly', 'Annual'];

  return (
    <div className="time-range-dropdown-group">
      <label className="time-range-dropdown-title">Time Range</label>
      <div className="time-range-dropdown-container">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="time-range-dropdown"
        >
          {timeRanges.map((timeRange) => (
            <option key={timeRange} value={timeRange}>
              {timeRange}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default TimeRangeDropdown;