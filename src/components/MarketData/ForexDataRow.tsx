import React from 'react';
import { formatNumber } from '../../utils/FormatNumber';

interface ForexDataRowProps {
  symbol: string;
  price?: number;
  priceChange?: number;
  percentChange?: number;
  high?: number;
  low?: number;
  updatedTime?: string;
}

const ForexDataRow: React.FC<ForexDataRowProps> = ({
  symbol,
  price,
  priceChange,
  percentChange,
  high,
  low,
  updatedTime,
}) => {
  return (
    <tr>
      <td>{symbol}</td>
      <td>{price !== undefined ? formatNumber(price) : '-'}</td>
      <td>{priceChange !== undefined ? formatNumber(priceChange) : '-'}</td>
      <td>{percentChange !== undefined ? `${formatNumber(percentChange)}%` : '-'}</td>
      <td>{high !== undefined ? formatNumber(high) : '-'}</td>
      <td>{low !== undefined ? formatNumber(low) : '-'}</td>
      <td>{updatedTime ? new Date(updatedTime).toLocaleString() : '-'}</td>
      <td></td> {/* No actions for this row */}
    </tr>
  );
};

export default ForexDataRow;