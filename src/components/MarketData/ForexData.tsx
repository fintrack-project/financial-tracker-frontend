import React, { useState, useEffect } from 'react';
import ForexDataRow from './ForexDataRow';
import BlankForexDataRow from './BlankForexDataRow';
import InputForexDataRow from './InputForexDataRow';
import { fetchForexData } from '../../services/forexDataService';
import { formatNumber } from '../../utils/FormatNumber';
import './ForexData.css';

interface ForexDataProps {
  accountId: string | null; // Account ID to filter holdings
}

const ForexData: React.FC<ForexDataProps> = ({ accountId }) => {
  const [inputRows, setInputRows] = useState<string[]>([]); // List of input rows
  const [forexData, setForexData] = useState<any[]>([]); // Fetched forex data

  const handleAddRow = () => {
    setInputRows([...inputRows, '']); // Add a blank input row
  };

  const handleRemoveRow = (index: number) => {
    setInputRows(inputRows.filter((_, i) => i !== index)); // Remove the input row
  };

  const handleSymbolChange = (index: number, value: string) => {
    const updatedRows = [...inputRows];
    updatedRows[index] = value;
    setInputRows(updatedRows);
  };

  return (
    <div className="forex-data-container">
      <table className="forex-data-table">
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Price</th>
            <th>Price Change</th>
            <th>% Change</th>
            <th>High</th>
            <th>Low</th>
            <th>Updated Time</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <BlankForexDataRow onAddRow={handleAddRow} />
          {forexData.map((data) => (
            <ForexDataRow key={data.symbol} {...data} />
          ))}
          {inputRows.map((symbol, index) => (
            <InputForexDataRow
              key={index}
              symbol={symbol}
              onSymbolChange={(value) => handleSymbolChange(index, value)}
              onRemoveRow={() => handleRemoveRow(index)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ForexData;