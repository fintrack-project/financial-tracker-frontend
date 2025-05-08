import React from 'react';
import './ValueDisplay.css';

interface ValueDisplayProps {
  value: number;
  change?: number;
  currency?: string;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export const ValueDisplay: React.FC<ValueDisplayProps> = ({
  value,
  change,
  currency = 'USD',
  prefix,
  suffix,
  className = ''
}) => {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num);
  };

  const formatChange = (num: number) => {
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      signDisplay: 'always'
    }).format(num);
    return `${formatted}%`;
  };

  const getChangeClass = (changeValue: number) => {
    if (changeValue > 0) return 'positive';
    if (changeValue < 0) return 'negative';
    return 'neutral';
  };

  return (
    <div className={`value-display ${className}`}>
      <div className="value">
        {prefix && <span className="prefix">{prefix}</span>}
        <span className="amount">{formatNumber(value)}</span>
        {suffix && <span className="suffix">{suffix}</span>}
      </div>
      {change !== undefined && (
        <div className={`change ${getChangeClass(change)}`}>
          {formatChange(change)}
        </div>
      )}
    </div>
  );
}; 