import React, { useState, useEffect } from 'react';
import './CustomRangeInput.css';

interface CustomRangeInputProps {
  startDate: Date;
  endDate: Date;
  onRangeChange: (startDate: Date, endDate: Date) => void;
  disabled?: boolean;
}

const CustomRangeInput: React.FC<CustomRangeInputProps> = ({
  startDate,
  endDate,
  onRangeChange,
  disabled = false
}) => {
  const formatDateForInput = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  const [localStartDate, setLocalStartDate] = useState(formatDateForInput(startDate));
  const [localEndDate, setLocalEndDate] = useState(formatDateForInput(endDate));

  useEffect(() => {
    setLocalStartDate(formatDateForInput(startDate));
    setLocalEndDate(formatDateForInput(endDate));
  }, [startDate, endDate]);

  const handleStartDateChange = (value: string) => {
    setLocalStartDate(value);
    if (value && localEndDate) {
      const newStartDate = new Date(value);
      const newEndDate = new Date(localEndDate);
      if (newStartDate <= newEndDate) {
        onRangeChange(newStartDate, newEndDate);
      }
    }
  };

  const handleEndDateChange = (value: string) => {
    setLocalEndDate(value);
    if (localStartDate && value) {
      const newStartDate = new Date(localStartDate);
      const newEndDate = new Date(value);
      if (newStartDate <= newEndDate) {
        onRangeChange(newStartDate, newEndDate);
      }
    }
  };

  return (
    <div className="custom-range-input">
      <div className="date-inputs">
        <div className="date-input-group">
          <label htmlFor="start-date">Start Date</label>
          <input
            id="start-date"
            type="date"
            value={localStartDate}
            onChange={(e) => handleStartDateChange(e.target.value)}
            disabled={disabled}
            max={localEndDate}
          />
        </div>
        
        <div className="date-input-group">
          <label htmlFor="end-date">End Date</label>
          <input
            id="end-date"
            type="date"
            value={localEndDate}
            onChange={(e) => handleEndDateChange(e.target.value)}
            disabled={disabled}
            min={localStartDate}
            max={new Date().toISOString().split('T')[0]}
          />
        </div>
      </div>
    </div>
  );
};

export default CustomRangeInput; 